import deepEqual from "fast-deep-equal";
import { fromSchema, fromParameter } from "./lib/convert";
import type { Options, OptionsInternal } from "./openapi-schema-types";
import { NOT_SUPPORTED, STRUCTS } from "./consts";
import type { JSONSchema4 } from "json-schema";
import type { ParameterObject, ResponseObject } from "openapi-typescript/src/types";
import cloneDeep from "lodash/cloneDeep";
import type { AcceptibleInputSchema } from "./openapi-schema-types";

const patternPropertiesHandler = (schema) => {
  let pattern;
  const patternsObj = schema.patternProperties;
  const additProps = schema.additionalProperties;

  if (typeof additProps !== "object") {
    return schema;
  }

  for (pattern in patternsObj) {
    if (deepEqual(patternsObj[pattern], additProps)) {
      schema.additionalProperties = false;
      break;
    }
  }

  return schema;
};

const resolveOptions = (_options?: Options): OptionsInternal => {
  const options = cloneDeep(_options || {}) as OptionsInternal;

  options.dateToDateTime = Boolean(options.dateToDateTime);
  options.cloneSchema ??= true;
  options.supportPatternProperties = Boolean(options.supportPatternProperties);
  options.keepNotSupported ??= [];
  options.definitionKeywords ??= [];
  options.strictMode ??= true;

  if (typeof options.patternPropertiesHandler !== "function") {
    options.patternPropertiesHandler = patternPropertiesHandler;
  }

  options._removeProps = [];

  if (options.removeReadOnly) {
    options._removeProps.push("readOnly");
  }

  if (options.removeWriteOnly) {
    options._removeProps.push("writeOnly");
  }

  options._structs = STRUCTS;
  options._notSupported = NOT_SUPPORTED.filter((l) => {
    return !options.keepNotSupported?.includes(l);
  });

  return options;
};

const openapiSchemaToJsonSchema = <T extends AcceptibleInputSchema = AcceptibleInputSchema>(
  schema: T,
  options?: Options,
): JSONSchema4 => {
  const optionsInternal = resolveOptions(options);
  return fromSchema<T>(schema, optionsInternal);
};

const openapiParameterToJsonSchema = (parameter: ParameterObject | ResponseObject, options?: Options): JSONSchema4 => {
  const optionsInternal = resolveOptions(options);
  return fromParameter(parameter, optionsInternal);
};

export {
  openapiParameterToJsonSchema as fromParameter,
  openapiSchemaToJsonSchema as fromSchema,
  openapiSchemaToJsonSchema,
};
export default openapiSchemaToJsonSchema;
