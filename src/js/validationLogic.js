import Joi from "joi-browser";

export const validateProperty = (event, schema) => {
  const { name, value } = event.target;
  const obj = { [name]: value };
  const subSchema = { [name]: schema[name] };
  const result = Joi.validate(obj, subSchema);
  const { error } = result;
  return error ? error.details[0].message : null;
};
