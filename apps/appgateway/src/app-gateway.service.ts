import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE, ORDER_SERVICE } from './constants/services';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class AppGatewayService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    @Inject(ORDER_SERVICE) private orderClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest, authentication: string) {
    const session = await this.ordersRepository.startTransaction();
    try {
      console.log('request---->', request)
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }

  //----------------------------------------------
  
  async createOrderV2(request: CreateOrderRequest, authentication: string){
    console.log('hit at app-gateway.service.......................');
    this.billingClient.emit(
      'create_order_v2',{
        request,
        Authentication: authentication,
      }
    );
  }

  async getOrdersV2(){
    console.log('getorderv2 in appgateway svc................');
    try{
      await this.billingClient.emit('fetch_order_v2', {});
    } catch(err){
      console.log('----------------- gateway service err', err);
    }
  }

  sendHiToBilling(){
    console.log('----------------- gateway service');
    this.orderClient.emit('hi_received_order', {});
    this.billingClient.emit('hi_received', {});
  }
}
