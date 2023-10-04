import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;
}

export const OrderIdResponse = [Order];