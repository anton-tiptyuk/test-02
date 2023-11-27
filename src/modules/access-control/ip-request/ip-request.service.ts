import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { IP_REQUEST_MODEL } from './ip-request.schema';
import { IpRequest } from './ip-request.interface';

@Injectable()
export class IpRequestService {
  constructor(
    @Inject(IP_REQUEST_MODEL)
    private readonly ipRequestModel: Model<IpRequest>,
  ) {}
}
