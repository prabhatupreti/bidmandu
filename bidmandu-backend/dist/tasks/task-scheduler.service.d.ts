import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
export declare class TaskSchedulerService implements OnModuleInit {
    private scheduledQueue;
    constructor(scheduledQueue: Queue);
    onModuleInit(): Promise<void>;
}
