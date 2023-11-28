import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/domain/guards/auth-guard';

@ApiBearerAuth()
@ApiTags('business')
@UseGuards(AuthGuard)
@Controller('business/first')
export class FirstController {
  @Get('get-01-endpoint')
  get01() {
    return 'get01';
  }
}
