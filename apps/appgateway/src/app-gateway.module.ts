import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule, AuthModule } from '@app/common';
import { AppGatewayController } from './app-gateway.controller';
import { AppGatewayService } from './app-gateway.service';
import { OrdersRepository } from './orders.repository';
import { Order, OrderSchema } from './schemas/order.schema';
import { BILLING_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/appgateway/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [AppGatewayController],
  providers: [AppGatewayService, OrdersRepository],
})
export class AppGatewayModule {}
