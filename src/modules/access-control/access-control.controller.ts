import { Controller, Post } from '@nestjs/common';

import { AccessControlService } from './access-control.service';

@Controller()
export class AccessControlController {
  constructor(private readonly service: AccessControlService) {}

  @Post('seed')
  seed() {
    return this.service.seed();
  }
}
