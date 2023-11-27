import { Module } from '@nestjs/common';

import { DbModule } from './modules/db/db.module';
import { AccessControlModule } from './modules/access-control/access-control.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DbModule, AccessControlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
