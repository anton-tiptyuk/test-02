import { Module } from '@nestjs/common';

import { AccessControlModule } from '../access-control/access-control.module';

import { FirstController } from './first.controller';

@Module({
  imports: [AccessControlModule],
  controllers: [FirstController],
})
export class BusinessModule {}
