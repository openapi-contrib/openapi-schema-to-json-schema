import convertFromSchema from "./converters/schema";
import convertFromParameter from "./converters/parameter";

export const fromSchema = convertFromSchema;
export const fromParameter = convertFromParameter;

export default {
  fromSchema: convertFromSchema,
  fromParameter: convertFromParameter,
};
