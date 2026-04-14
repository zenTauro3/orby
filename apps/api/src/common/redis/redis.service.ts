import { Inject, Injectable } from '@nestjs/common';
import type { createClient } from 'redis';
import { REDIS_CLIENT } from './redis.module';

type RedisClient = ReturnType<typeof createClient>;

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly client: RedisClient) {}

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds !== undefined) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}
