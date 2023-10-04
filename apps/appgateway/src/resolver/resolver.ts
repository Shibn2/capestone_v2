import { OrderIdResponse } from '../graphql.schema';

@Resolver('Order')
export class OrderResolver {
  @Query(() => OrderIdResponse)
  getOrder(id): number {
    const orders = this.getOrders();
    return orders.find((order) => order.id === id);
  }
}
