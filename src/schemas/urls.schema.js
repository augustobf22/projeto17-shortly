import Joi from "joi"

export const schemaUrl = Joi.object({
    url: Joi.string().uri().required()
})