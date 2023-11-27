import { NestFactory } from '@nestjs/core';

import { config } from './common/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.webPort);
}
bootstrap();
