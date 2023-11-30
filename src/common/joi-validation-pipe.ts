import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.AnySchema) {}

  static validateAndReturn<T>(
    input: T,
    schema: Joi.AnySchema,
    onError: (err: Joi.ValidationError) => void,
  ) {
    const { error, value } = (<Joi.AnySchema<T>>schema).validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      onError && onError(error);
    }

    return { value, valid: !error, error };
  }

  transform(input: any) {
    return JoiValidationPipe.validateAndReturn(input, this.schema, (error) => {
      const { details, _original } = error;
      throw new BadRequestException({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errors: details.map(({ type, context, ...rest }) => rest),
        object: _original,
      });
    }).value;
  }
}
