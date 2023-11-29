import { Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';
import { AccessControlModule } from '../access-control/access-control.module';

import { FirstController } from './first.controller';
import { SecondController } from './second.controller';
import { RedisTryController } from './redis-try.controller';

@Module({
  imports: [RedisModule, AccessControlModule],
  controllers: [FirstController, SecondController, RedisTryController],
})
export class BusinessModule {}
