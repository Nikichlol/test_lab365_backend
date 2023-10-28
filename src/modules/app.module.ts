import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvironmentVariables } from 'src/types/env';
import { UserModule } from './user/user.module';
import { SecretModule } from './global/secret/secret.module';
import { TasksModule } from './task/tasks.module';

@Module({
  imports: [
    SecretModule,
    AuthModule,
    UserModule,
    TasksModule,
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
        JWT_SECRET_KEY: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
        SECRET_SALT: Joi.string().required(),
        APP_PORT: Joi.number().required(),
      }),
    }),
  ],
})
export class AppModule {}
