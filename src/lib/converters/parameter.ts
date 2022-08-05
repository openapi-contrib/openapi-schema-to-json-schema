import convertFromSchema from "./schema";
import InvalidInputError from "../errors/invalid-input-error";
import type { OptionsInternal } from "../../types";
import type { ParameterObject } from "openapi-typescript/src/types";
import type { ResponseObject } from "openapi-typescript/src/types";
import type { JSONSchema4 } from "json-schema";

const convertParameterSchema = ({ description }: ParameterObject | ResponseObject, schema, options): JSONSchema4 => {
  const jsonSchema = convertFromSchema(schema || {}, options);

  if (description) {
    jsonSchema.description = description;
  }

  return jsonSchema;
};

const convertFromContents = (parameter: ResponseObject, options: OptionsInternal): JSONSchema4 => {
  const schemas = {};

  for (const mime in parameter.content) {
    schemas[mime] = convertParameterSchema(parameter, parameter.content[mime].schema, options);
  }

  return schemas;
};

// Convert from OpenAPI 3.0 `ParameterObject` to JSON schema v4
const convertFromParameter = (parameter: ParameterObject | ResponseObject, options: OptionsInternal): JSONSchema4 => {
  if ("schema" in parameter && parameter.schema) {
    return convertParameterSchema(parameter, parameter.schema, options);
  }
  if ("content" in parameter && parameter.content) {
    return convertFromContents(parameter, options);
  }
  if (options.strictMode) {
    throw new InvalidInputError("OpenAPI parameter must have either a 'schema' or a 'content' property");
  }
  return convertParameterSchema(parameter, {}, options);
};

export default convertFromParameter;
