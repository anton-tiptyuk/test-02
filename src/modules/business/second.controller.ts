import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RateLimitGuard } from '@/domain/guards';
import { RateLimitWeight } from '@/domain/decorators';

@ApiTags('business')
@UseGuards(RateLimitGuard)
@Controller('business/second')
export class SecondController {
  @Get('get-01-endpoint')
  get01() {
    return 'get01';
  }

  @RateLimitWeight(4)
  @Get('get-weight-4')
  getWeight4() {
    return 'getWeight4';
  }
}
