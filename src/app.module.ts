import { Module } from '@nestjs/common';

import { RedisModule } from './modules/redis/redis.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { BusinessModule } from './modules/business/business.module';

@Module({
  imports: [RedisModule, AccessControlModule, BusinessModule],
})
export class AppModule {}
