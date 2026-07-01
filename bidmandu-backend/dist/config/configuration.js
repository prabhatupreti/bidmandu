"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'bidmandu',
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME || 'bidmandu',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRY || '7d',
    },
    storage: {
        driver: process.env.STORAGE_DRIVER || 'local',
        localPath: process.env.STORAGE_LOCAL_PATH || './uploads',
        s3: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            bucket: process.env.AWS_S3_BUCKET,
        },
    },
});
//# sourceMappingURL=configuration.js.map