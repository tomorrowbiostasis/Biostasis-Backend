import * as Joi from 'joi';
import { timeSlotSchema } from './time-slot.schema';

export const addTimeSlotSchema: Joi.ObjectSchema = Joi.object(
  timeSlotSchema
).options({
  presence: 'optional',
});
