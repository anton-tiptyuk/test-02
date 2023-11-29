import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RateLimitGuard } from '@/domain/guards';

@ApiBearerAuth()
@ApiTags('business')
@UseGuards(AuthGuard, RateLimitGuard)
@Controller('business/first')
export class FirstController {
  @Get('get-01-endpoint')
  get01() {
    return 'get01';
  }
}
