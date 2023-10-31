import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../types/env';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH',
        imports: [ConfigModule],
        useFactory: (
          configService: ConfigService<EnvironmentVariables, true>,
        ) => ({
          transport: Transport.TCP,
          options: {
            port: 4001,
            host:
              configService.get('AUTH_SERVICE_HOST', { infer: true }) ??
              'localhost',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
