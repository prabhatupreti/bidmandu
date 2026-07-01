import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfig } from './entities/system-config.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig])],
  exports: [TypeOrmModule],
})
export class SystemConfigModule {}