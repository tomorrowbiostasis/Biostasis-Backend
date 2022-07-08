import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { VALIDATION_FAILED } from '../error/keys';
import { CustomError } from '../error/custom-error';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema, private readonly options?: {transform: boolean}) {
  }

  public async transform(obj: object, metadata: ArgumentMetadata): Promise<object> {
    if (this.options?.transform) {
      obj = plainToClass(metadata.metatype, obj);
    }

    const {error, value} = (this.schema as any).validate(obj);
    if (error) {
      throw new CustomError(VALIDATION_FAILED, error);
    }
    return value;
  }
}
