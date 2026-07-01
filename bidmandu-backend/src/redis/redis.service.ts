import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor(private config: ConfigService) {
    this.client = new Redis({
      host: config.get<string>('redis.host'),
      port: config.get<number>('redis.port'),
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string) {
    return this.client.set(key, value);
  }

  async incr(key: string) {
    return this.client.incr(key);
  }

  async eval(script: string, keys: string[], args: any[]) {
    return this.client.eval(script, keys.length, ...keys, ...args);
  }
}