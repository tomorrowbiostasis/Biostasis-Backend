import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { VALIDATION_FAILED } from '../error/keys';
import { CustomError } from '../error/custom-error';

@Injectable()
export class NumericIdValidationPipe implements PipeTransform {
  private schema: Joi.Schema;

  constructor() {
    this.schema = Joi.number().integer().positive().required();
  }

  public transform(data: string, metadata: ArgumentMetadata): number {
    const { error, value } = (this.schema as any).validate(+data);
    if (error) {
      throw new CustomError(VALIDATION_FAILED, error);
    }
    return value;
  }
}
