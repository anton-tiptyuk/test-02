import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { config } from '@/common';

@Module({
  imports: [MongooseModule.forRoot(config.mongoUrl)],
  exports: [MongooseModule],
})
export class DbModule {}
