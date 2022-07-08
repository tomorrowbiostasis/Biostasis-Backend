import * as Joi from 'joi';
import { DAYS_OF_WEEKS } from '../../enum/days-of-week.enum';
import { getEnumKeys } from '../../../common/helper/get-enum-keys';

export const timeSlotSchema = {
  active: Joi.boolean(),
  from: Joi.date().iso().allow(null),
  to: Joi.date().iso().required(),
  timezone: Joi.string().required(),
  days: Joi.array()
    .items(
      Joi.string()
        .valid(...getEnumKeys(DAYS_OF_WEEKS, true))
        .required()
    )
    .required(),
};
