"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        const stripeSecretKey = this.config.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            console.warn('STRIPE_SECRET_KEY not configured');
        }
        this.stripe = new stripe_1.default(stripeSecretKey || 'sk_test_dummy', {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckoutSession(userId, planId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const plans = {
            basic: {
                name: 'Plano Básico',
                price: 9900,
                currency: 'brl',
                interval: 'month',
            },
            professional: {
                name: 'Plano Profissional',
                price: 19900,
                currency: 'brl',
                interval: 'month',
            },
            enterprise: {
                name: 'Plano Enterprise',
                price: 39900,
                currency: 'brl',
                interval: 'month',
            },
        };
        const selectedPlan = plans[planId];
        if (!selectedPlan) {
            throw new common_1.BadRequestException('Invalid plan');
        }
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                customer_email: user.email,
                line_items: [
                    {
                        price_data: {
                            currency: selectedPlan.currency,
                            product_data: {
                                name: selectedPlan.name,
                                description: `Assinatura mensal do ${selectedPlan.name} - Proclinic`,
                            },
                            unit_amount: selectedPlan.price,
                            recurring: {
                                interval: selectedPlan.interval,
                            },
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${this.config.get('FRONTEND_URL')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${this.config.get('FRONTEND_URL')}/subscription/cancel`,
                metadata: {
                    userId: user.id,
                    planId: planId,
                },
            });
            return {
                sessionId: session.id,
                url: session.url,
            };
        }
        catch (error) {
            console.error('Stripe checkout error:', error);
            throw new common_1.BadRequestException('Failed to create checkout session');
        }
    }
    async handleWebhook(signature, payload) {
        const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new common_1.BadRequestException('Webhook secret not configured');
        }
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            switch (event.type) {
                case 'checkout.session.completed':
                    await this.handleCheckoutSessionCompleted(event.data.object);
                    break;
                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object);
                    break;
                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object);
                    break;
                case 'invoice.payment_succeeded':
                    await this.handleInvoicePaymentSucceeded(event.data.object);
                    break;
                case 'invoice.payment_failed':
                    await this.handleInvoicePaymentFailed(event.data.object);
                    break;
            }
            return { received: true };
        }
        catch (error) {
            console.error('Webhook error:', error);
            throw new common_1.BadRequestException('Webhook signature verification failed');
        }
    }
    async handleCheckoutSessionCompleted(session) {
        var _a, _b;
        const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
        const planId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.planId;
        if (!userId || !planId) {
            console.error('Missing metadata in checkout session');
            return;
        }
        const subscriptionData = {
            userId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            stripePriceId: null,
            status: 'active',
            planId,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };
        console.log('Subscription created:', subscriptionData);
    }
    async handleSubscriptionUpdated(subscription) {
        console.log('Subscription updated:', subscription.id);
    }
    async handleSubscriptionDeleted(subscription) {
        console.log('Subscription deleted:', subscription.id);
    }
    async handleInvoicePaymentSucceeded(invoice) {
        console.log('Invoice payment succeeded:', invoice.id);
    }
    async handleInvoicePaymentFailed(invoice) {
        console.log('Invoice payment failed:', invoice.id);
    }
    async getSubscriptionStatus(userId) {
        return {
            active: false,
            planId: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
        };
    }
    async cancelSubscription(userId) {
        try {
            return {
                success: true,
                message: 'Subscription will be cancelled at the end of the billing period',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to cancel subscription');
        }
    }
    async getPlans() {
        return [
            {
                id: 'basic',
                name: 'Plano Básico',
                price: 99.00,
                currency: 'BRL',
                interval: 'mensal',
                features: [
                    'Até 100 pacientes',
                    'Gestão de procedimentos',
                    'Relatórios básicos',
                    'Suporte por email',
                ],
            },
            {
                id: 'professional',
                name: 'Plano Profissional',
                price: 199.00,
                currency: 'BRL',
                interval: 'mensal',
                popular: true,
                features: [
                    'Pacientes ilimitados',
                    'Gestão completa de estoque',
                    'Relatórios avançados',
                    'Controle de custos',
                    'Suporte prioritário',
                ],
            },
            {
                id: 'enterprise',
                name: 'Plano Enterprise',
                price: 399.00,
                currency: 'BRL',
                interval: 'mensal',
                features: [
                    'Tudo do Profissional',
                    'Múltiplas clínicas',
                    'API completa',
                    'Customizações',
                    'Suporte 24/7',
                    'Gerente de conta dedicado',
                ],
            },
        ];
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map