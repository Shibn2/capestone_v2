import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('ORDER'));
  await app.startAllMicroservices();
}
bootstrap();
