import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { EnvironmentVariables } from './types/env';
import { TasksModule } from './task/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => {
        const dbHost = configService.get('MONGO_HOST', { infer: true });

        return {
          dbName: configService.get('MONGO_DATABASE', { infer: true }),
          uri: `mongodb://${dbHost ?? '127.0.0.1'}:27017`,
          auth: {
            username: configService.get('MONGO_USERNAME', { infer: true }),
            password: configService.get('MONGO_PASSWORD', { infer: true }),
          },
          authMechanism: 'DEFAULT',
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().optional(),
        AUTH_SERVICE_HOST: Joi.string().optional(),
      }),
    }),
  ],
})
export class AppModule {}
