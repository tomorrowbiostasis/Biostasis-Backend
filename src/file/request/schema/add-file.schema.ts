import * as Joi from 'joi';
import { CATEGORY } from '../../enum/category.enum';

export const addFileSchema: Joi.ObjectSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(CATEGORY))
    .required(),
});
