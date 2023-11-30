import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RateLimitGuard } from '@/domain/guards';
import { RateLimitWeight } from '@/domain/decorators';

@ApiBearerAuth()
@ApiTags('business')
@UseGuards(AuthGuard, RateLimitGuard)
@Controller('business/first')
export class FirstController {
  @Get('get-01-endpoint')
  get01() {
    return 'get01';
  }

  @RateLimitWeight(4)
  @Get('get-weight-4')
  getWeight4() {
    return 'getWeight4';
  }

  @RateLimitWeight(2)
  @Post('post-weight-2')
  postWeight2() {
    return 'postWeight2';
  }
}
