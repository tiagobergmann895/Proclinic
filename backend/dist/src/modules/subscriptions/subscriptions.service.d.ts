import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly config;
    private stripe;
    constructor(prisma: PrismaService, config: ConfigService);
    createCheckoutSession(userId: string, planId: string): Promise<{
        sessionId: any;
        url: any;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private handleCheckoutSessionCompleted;
    private handleSubscriptionUpdated;
    private handleSubscriptionDeleted;
    private handleInvoicePaymentSucceeded;
    private handleInvoicePaymentFailed;
    getSubscriptionStatus(userId: string): Promise<{
        active: boolean;
        planId: null;
        currentPeriodEnd: null;
        cancelAtPeriodEnd: boolean;
    }>;
    cancelSubscription(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPlans(): Promise<({
        id: string;
        name: string;
        price: number;
        currency: string;
        interval: string;
        features: string[];
        popular?: undefined;
    } | {
        id: string;
        name: string;
        price: number;
        currency: string;
        interval: string;
        popular: boolean;
        features: string[];
    })[]>;
}
