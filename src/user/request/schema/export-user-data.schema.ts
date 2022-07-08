import * as Joi from "joi";

export const exportUserDataSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
});
