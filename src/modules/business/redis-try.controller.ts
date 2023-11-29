import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RedisService } from '../redis/redis.service';

@ApiTags('business')
@Controller('business/redis-try')
export class RedisTryController {
  constructor(private readonly service: RedisService) {}

  @Post('try01')
  try01() {
    return this.service.try01();
  }

  @Post('lua-try01')
  luaTry01() {
    return this.service.luaTry01();
  }

  @Post('lua-try02')
  luaTry02() {
    return this.service.luaTry02();
  }
}
