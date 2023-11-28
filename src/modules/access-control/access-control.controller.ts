import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccessControlService } from './access-control.service';

@ApiTags('access-control')
@Controller()
export class AccessControlController {
  constructor(private readonly service: AccessControlService) {}

  @Post('seed')
  seed() {
    return this.service.seed();
  }
}
