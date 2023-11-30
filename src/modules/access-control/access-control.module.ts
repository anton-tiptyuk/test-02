import { ExistingProvider, Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';

import { AccessControlService } from './access-control.service';

import { AccessControlController } from './access-control.controller';
import { ACCESS_CONTROL_PROVIDER } from '@/domain/access-control';

const acProviderAlias: ExistingProvider = {
  provide: ACCESS_CONTROL_PROVIDER,
  useExisting: AccessControlService,
};

@Module({
  imports: [RedisModule],
  providers: [AccessControlService, acProviderAlias],
  controllers: [AccessControlController],
  exports: [AccessControlService, acProviderAlias],
})
export class AccessControlModule {}
