import { RawBodyRequest } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly service;
    constructor(service: SubscriptionsService);
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
    createCheckoutSession(body: {
        planId: string;
    }, req: any): Promise<{
        sessionId: any;
        url: any;
    }>;
    getStatus(req: any): Promise<{
        active: boolean;
        planId: null;
        currentPeriodEnd: null;
        cancelAtPeriodEnd: boolean;
    }>;
    cancelSubscription(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
