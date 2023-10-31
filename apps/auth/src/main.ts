import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { EnvironmentVariables } from './types/env';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 4001,
      host:
        configService.get('AUTH_SERVICE_HOST', { infer: true }) ?? 'localhost',
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);

  Logger.log('Auth microservice running');
}
bootstrap();
