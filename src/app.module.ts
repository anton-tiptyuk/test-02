import { Module } from '@nestjs/common';

import { RedisModule } from './modules/redis/redis.module';
import { DbModule } from './modules/db/db.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { BusinessModule } from './modules/business/business.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RedisModule, DbModule, AccessControlModule, BusinessModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
