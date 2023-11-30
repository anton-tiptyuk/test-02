import { Module } from '@nestjs/common';

import { RedisModule } from './modules/redis/redis.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { BusinessModule } from './modules/business/business.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RedisModule, AccessControlModule, BusinessModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
