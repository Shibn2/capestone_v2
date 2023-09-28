import { Controller, Get, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService, JwtAuthGuard } from '@app/common';
import { BillingService } from './billing.service';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.billingService.bill(data);
    this.rmqService.ack(context);
  }

  //---------------------------------
  @EventPattern('create_order_v2')
  async handleOrderCreatedV2(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('=========================================> create_order_v2 in billing', data)
    this.billingService.createOrder(data.request);
    this.rmqService.ack(context);
  }

  @EventPattern('fetch_order_v2')
  async fetchOrders() {
    console.log('get order ctrlr - billing................');
    return this.billingService.getOrders();
  }

  @EventPattern('hi_received')
  async handleHiFromGateway(@Ctx() context: RmqContext) {
    console.log('From billing , hi received from gateway');
    this.rmqService.ack(context);
  }
}
