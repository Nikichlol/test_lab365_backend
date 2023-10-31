import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService2 } from './jwt.service';
import { EnvironmentVariables } from '../../types/env';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => {
        return {
          secret: configService.get('JWT_SECRET_KEY', { infer: true }),
          signOptions: {
            expiresIn: '30d',
          },
        };
      },
    }),
  ],
  providers: [JwtService2],
  exports: [JwtService2],
})
export class JwtModule2 {}
