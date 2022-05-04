import * as Joi from "joi";

export const confirmUserEmailSchema: Joi.ObjectSchema = Joi.object({
  code: Joi.string().guid().required(),
});
