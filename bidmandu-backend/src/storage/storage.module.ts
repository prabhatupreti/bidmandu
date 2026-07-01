import { Module, Global } from '@nestjs/common';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';

const storageServiceProvider = {
  provide: 'IStorageService',
  useFactory: () => {
    const driver = process.env.STORAGE_DRIVER;
    if (driver === 's3') {
      return new S3StorageService();
    }
    return new LocalStorageService();
  },
};

@Global()
@Module({
  providers: [storageServiceProvider],
  exports: ['IStorageService'],
})
export class StorageModule {}