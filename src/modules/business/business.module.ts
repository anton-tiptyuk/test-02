import { Module } from '@nestjs/common';

import { AccessControlModule } from '../access-control/access-control.module';

import { FirstController } from './first.controller';
import { SecondController } from './second.controller';

@Module({
  imports: [AccessControlModule],
  controllers: [FirstController, SecondController],
})
export class BusinessModule {}
