import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AgentsModule } from './agents/agents.module';
import { BillingModule } from './billing/billing.module';

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
        JWT_SECRET: Joi.string().required().min(16),
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
    AuthModule,
    AgentsModule,
    BillingModule,
  ],
})
export class AppModule {}
