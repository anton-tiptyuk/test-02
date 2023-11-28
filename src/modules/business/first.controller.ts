import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('business')
export class FirstController {
  @Get('get-01-endpoint')
  get01() {
    return 'get01';
  }
}
