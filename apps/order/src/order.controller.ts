import { Controller, Get, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService, JwtAuthGuard } from '@app/common';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }

  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.orderService.bill(data);
    this.rmqService.ack(context);
  }

  //---------------------------------
  @EventPattern('create_order_v2')
  async handleOrderCreatedV2(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('........................... create_order_v2 in order ctrl ', data)
    this.orderService.createOrder(data.request);
    this.rmqService.ack(context);
  }

  @EventPattern('fetch_order_v2')
  async fetchOrders() {
    console.log('........................... get order ctrl order ctrl');
    return this.orderService.getOrders();
  }

  @EventPattern('hi_received_order')
  async handleHiFromGateway(@Ctx() context: RmqContext) {
    console.log('........................... from order , hi received from gateway order ctrl');
    this.rmqService.ack(context);
  }
}

// /Users/shilal/Documents/In_/excelerator/Case_study/Capestone_V2Ref/capestone_v1.9/capestone_v2/apps/order/src