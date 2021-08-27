import * as Joi from 'joi';
import * as moment from 'moment';
import { DAYS_OF_WEEKS } from '../../enum/days-of-week.enum';
import { getEnumKeys } from '../../../common/helper/get-enum-keys';

export const timeSlotSchema = {
  active: Joi.boolean(),
  from: Joi.date().iso(),
  to: Joi.date()
    .iso()
    .min(
      Joi.ref('from', {
        adjust: (value) => {
          return value ? moment(value).toDate() : 0;
        },
      })
    )
    .required(),
  days: Joi.array()
    .items(
      Joi.string()
        .valid(...getEnumKeys(DAYS_OF_WEEKS, true))
        .required()
    )
    .required(),
};
