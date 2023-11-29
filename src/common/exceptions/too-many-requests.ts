import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    description = 'Too many requests',
  ) {
    super(
      HttpException.createBody(
        objectOrError,
        description,
        HttpStatus.TOO_MANY_REQUESTS,
      ),
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
