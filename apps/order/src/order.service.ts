import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { APP_GATEWAY } from './constants/services';

@Injectable()
export class OrderService {
  constructor(    
    private readonly ordersRepository: OrdersRepository,
    @Inject(APP_GATEWAY) private gatewayClient: ClientProxy,
    ){}
  private readonly logger = new Logger(OrderService.name);

  getHello(): string {
    return 'Hello World!';
  }

  bill(data: any) {
    this.logger.log('Order...', data);
  }

  // --------------------
  async createOrder(request: CreateOrderRequest) {
    console.log('........................... Hit at order service order svc')
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      console.log('in order svc create order, after create', order)
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async getOrders() {
    console.log('........................... get order svc - order order svc');
    const orders = await this.ordersRepository.find({});
    await this.gatewayClient.emit('fetched-order', orders);
    console.log('orders', orders);
  }
}
