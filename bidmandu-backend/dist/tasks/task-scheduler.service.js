"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
let TaskSchedulerService = class TaskSchedulerService {
    constructor(scheduledQueue) {
        this.scheduledQueue = scheduledQueue;
    }
    async onModuleInit() {
        const repeatable = await this.scheduledQueue.getRepeatableJobs();
        for (const job of repeatable) {
            await this.scheduledQueue.removeRepeatableByKey(job.key);
        }
        await this.scheduledQueue.add('auto-confirm-receipt', {}, {
            repeat: { cron: '0 * * * *' },
            jobId: 'auto-confirm-receipt-repeat',
        });
    }
};
exports.TaskSchedulerService = TaskSchedulerService;
exports.TaskSchedulerService = TaskSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('scheduled-tasks')),
    __metadata("design:paramtypes", [Object])
], TaskSchedulerService);
//# sourceMappingURL=task-scheduler.service.js.map