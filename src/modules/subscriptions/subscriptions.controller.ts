import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request, 
  Headers, 
  RawBodyRequest, 
  Req 
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Listar planos disponíveis' })
  getPlans() {
    return this.service.getPlans();
  }

  @Post('create-checkout-session')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('gestor')
  @ApiOperation({ summary: 'Criar sessão de checkout no Stripe' })
  createCheckoutSession(
    @Body() body: { planId: string },
    @Request() req: any,
  ) {
    return this.service.createCheckoutSession(req.user.userId, body.planId);
  }

  @Get('status')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Verificar status da assinatura' })
  getStatus(@Request() req: any) {
    return this.service.getSubscriptionStatus(req.user.userId);
  }

  @Post('cancel')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('gestor')
  @ApiOperation({ summary: 'Cancelar assinatura' })
  cancelSubscription(@Request() req: any) {
    return this.service.cancelSubscription(req.user.userId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook do Stripe (não requer autenticação)' })
  handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.service.handleWebhook(signature, req.rawBody || Buffer.alloc(0));
  }
}




