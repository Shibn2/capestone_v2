import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { AppGatewayService } from './app-gateway.service';

@Controller('orders')
export class AppGatewayController {
  constructor(private readonly appGatewayService: AppGatewayService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateOrderRequest, @Req() req: any) {
    return this.appGatewayService.createOrder(request, req.cookies?.Authentication);
  }

  @Get()
  async getOrders() {
    return this.appGatewayService.getOrders();
  }

  //---------------------------- implementation
  @Post('order')
  async createOrderV2(@Body() request: CreateOrderRequest, @Req() req: any) {
    console.log('hit at orders/order app-gateway.......................', request);
    return this.appGatewayService.createOrderV2(request, req.cookies?.Authentication);
  }

  @Get('hello')
  getHello(): string {
    console.log('hit --------------------------->>>>>>>>>>>>>> gateway controller');
    this.appGatewayService.sendHiToBilling();
    return 'Hello, World!!!';
    // return this.appGatewayService.getHello();
  }

  @Get('order')
  async getOrdersV2() {
    console.log('getorderv2 in appgateway ctrl................');
    return this.appGatewayService.getOrdersV2();
  }

  @EventPattern('fetched-order')
  async fetchOrders(@Payload() data: any) {
    console.log('fetched-order - order received at app-gateway................data', data);
  }
}
