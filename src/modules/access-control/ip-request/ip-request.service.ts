import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IpRequest } from './ip-request.schema';

@Injectable()
export class IpRequestService {
  constructor(
    @InjectModel(IpRequest.name)
    private readonly model: Model<IpRequest>,
  ) {}
}
