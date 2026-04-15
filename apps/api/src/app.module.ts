import { Module } from '@nestjs/common'
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import Joi from 'joi'

import { PrismaModule } from '@core/prisma/prisma.module'
import { RedisModule } from '@core/redis/redis.module'

import { JwtAuthGuard } from '@common/guards'
import { GlobalExceptionFilter } from '@common/filters'
import { LoggingInterceptor, ResponseInterceptor } from '@common/interceptors'

import { AuthModule } from '@modules/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(4000),
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().default('redis://localhost:6379'),
        JWT_SECRET: Joi.string().required().min(32),
        JWT_REFRESH_SECRET: Joi.string().required().min(32),
        ANTHROPIC_API_KEY: Joi.string().optional(),
        GOOGLE_CLIENT_ID: Joi.string().optional(),
        GOOGLE_CLIENT_SECRET: Joi.string().optional(),
        STRIPE_SECRET_KEY: Joi.string().optional(),
        STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
        FRONTEND_URL: Joi.string().default('http://localhost:3000'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    PrismaModule,
    RedisModule,   
    AuthModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,          
        forbidNonWhitelisted: true, 
        transform: true,         
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,  
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, 
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}