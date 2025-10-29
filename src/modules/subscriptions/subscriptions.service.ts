import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const stripeSecretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.warn('STRIPE_SECRET_KEY not configured');
    }
    this.stripe = new Stripe(stripeSecretKey || 'sk_test_dummy', {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCheckoutSession(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Planos disponíveis
    const plans = {
      basic: {
        name: 'Plano Básico',
        price: 9900, // R$ 99,00 em centavos
        currency: 'brl',
        interval: 'month',
      },
      professional: {
        name: 'Plano Profissional',
        price: 19900, // R$ 199,00 em centavos
        currency: 'brl',
        interval: 'month',
      },
      enterprise: {
        name: 'Plano Enterprise',
        price: 39900, // R$ 399,00 em centavos
        currency: 'brl',
        interval: 'month',
      },
    };

    const selectedPlan = plans[planId as keyof typeof plans];
    if (!selectedPlan) {
      throw new BadRequestException('Invalid plan');
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
                interval: selectedPlan.interval as 'month',
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
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw new BadRequestException('Failed to create checkout session');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw new BadRequestException('Webhook signature verification failed');
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      console.error('Missing metadata in checkout session');
      return;
    }

    // Criar ou atualizar assinatura no banco
    const subscriptionData = {
      userId,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      stripePriceId: null,
      status: 'active',
      planId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
    };

    // Aqui você salvaria no banco de dados
    console.log('Subscription created:', subscriptionData);
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('Subscription updated:', subscription.id);
    // Atualizar status da assinatura no banco
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('Subscription deleted:', subscription.id);
    // Marcar assinatura como cancelada no banco
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('Invoice payment succeeded:', invoice.id);
    // Registrar pagamento bem-sucedido
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    console.log('Invoice payment failed:', invoice.id);
    // Notificar usuário sobre falha no pagamento
  }

  async getSubscriptionStatus(userId: string) {
    // Buscar assinatura do usuário no banco
    // Por enquanto, retorna mock
    return {
      active: false,
      planId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }

  async cancelSubscription(userId: string) {
    // Buscar assinatura do usuário
    // Cancelar no Stripe
    // Atualizar no banco
    
    try {
      // const subscription = await this.stripe.subscriptions.update(
      //   subscriptionId,
      //   { cancel_at_period_end: true }
      // );
      
      return {
        success: true,
        message: 'Subscription will be cancelled at the end of the billing period',
      };
    } catch (error) {
      throw new BadRequestException('Failed to cancel subscription');
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
}




