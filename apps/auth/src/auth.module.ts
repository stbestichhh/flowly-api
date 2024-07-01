import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { LoggerModule } from '@app/common/logger';
import * as Joi from 'joi';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SECRET_KEY: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
