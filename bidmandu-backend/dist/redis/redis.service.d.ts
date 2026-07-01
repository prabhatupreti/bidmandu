import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleDestroy {
    private config;
    readonly client: Redis;
    constructor(config: ConfigService);
    onModuleDestroy(): void;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<"OK">;
    incr(key: string): Promise<number>;
    eval(script: string, keys: string[], args: any[]): Promise<unknown>;
}
