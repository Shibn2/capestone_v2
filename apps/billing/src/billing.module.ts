import { Module } from '@nestjs/common';
import { RmqModule, AuthModule, DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { ConfigModule } from '@nestjs/config';
import { OrdersRepository } from './orders.repository';
import { Order, OrderSchema } from './schemas/order.schema';
import { APP_GATEWAY } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/appgateway/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule.register({
      name: APP_GATEWAY,
    }),
    AuthModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, OrdersRepository],
})
export class BillingModule {}
