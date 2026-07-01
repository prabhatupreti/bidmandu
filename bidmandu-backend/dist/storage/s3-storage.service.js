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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageService = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const uuid_1 = require("uuid");
const path = require("path");
let S3StorageService = class S3StorageService {
    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucket = process.env.AWS_S3_BUCKET || '';
    }
    async upload(file, folder) {
        const ext = path.extname(file.originalname);
        const key = `${folder}/${(0, uuid_1.v4)()}${ext}`;
        await this.s3.upload({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }).promise();
        return key;
    }
    getUrl(key) {
        return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }
    async delete(key) {
        await this.s3.deleteObject({
            Bucket: this.bucket,
            Key: key,
        }).promise();
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3StorageService);
//# sourceMappingURL=s3-storage.service.js.map