import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { JoiValidationPipe } from '@/common';

import { AccessControlService } from './access-control.service';
import { seedSchema } from './dto';

@ApiTags('access-control')
@Controller('access-control')
export class AccessControlController {
  constructor(private readonly service: AccessControlService) {}

  @ApiBody({
    schema: {
      example: [
        'bbd6bc108d64afade9d89360590720b986585612',
        'd97c908ed44c25fdca302612c70584c8d5acd47a',
        'a50f71f97620945ab2250778b0379c459e9c63a5',
        'c658ffdd8d26875d2539cf78c9050c258a3f00e1',
        'd2014886ca0337e5d9196cfc5fecb4aa4892710d',
        '3bc6b2b1d8551b6a27146a8f0fa68ae4155c4f41',
        '4f655272c911c4fd6561959e416c4d3ec69b79aa',
        '13ca0cb775b4e79582e4d3f3577ad0f2b462a086',
        '6305ebaefc4fb9e3275589dd420b390eabba9d63',
        'f444df3ad683faa0529e79f3f554521340b52d98',
      ],
    },
  })
  @Post('seed')
  seed(
    @Body(new JoiValidationPipe(seedSchema))
    tokens: string[],
  ) {
    return this.service.seed(tokens);
  }
}
