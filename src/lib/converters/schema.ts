import { isObject } from "../utils/isObject";
import InvalidTypeError from "../errors/invalid-type-error";
import type { OptionsInternal } from "../../openapi-schema-types";
import type { JSONSchema4, JSONSchema4TypeName } from "json-schema";
import { VALID_OPENAPI_FORMATS } from "../../consts";
import type { SchemaObject } from "openapi-typescript/src/types";
import type { PatternPropertiesHandler } from "../../openapi-schema-types";
import type { OpenAPI3 } from "openapi-typescript";
import type { ReferenceObject } from "openapi-typescript/src/types";
import type { AcceptibleInputSchema } from "../../openapi-schema-types";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
// Convert from OpenAPI 3.0 `SchemaObject` to JSON schema v4
function convertFromSchema<T extends AcceptibleInputSchema = AcceptibleInputSchema>(
  schema: T,
  options: OptionsInternal,
): JSONSchema4 {
  const newSchema = convertSchema(schema, options);
  (<JSONSchema4>newSchema).$schema = "http://json-schema.org/draft-04/schema#";
  return newSchema;
}

function convertSchema(schema: OpenAPI3 | SchemaObject | ReferenceObject, options: OptionsInternal): JSONSchema4 {
  if (options.cloneSchema) {
    schema = cloneDeep(schema);
  }

  const structs = options._structs;
  const notSupported = options._notSupported;
  const strictMode = options.strictMode;
  const definitionKeywords = options.definitionKeywords || [];
  const beforeTransform = options.beforeTransform;
  const afterTransform = options.afterTransform;

  if (beforeTransform) {
    schema = beforeTransform(schema, options);
  }

  for (const struct of structs) {
    if (Array.isArray(schema[struct])) {
      let cloned = false;

      for (let j = 0; j < schema[struct].length; j++) {
        if (!isObject(schema[struct][j])) {
          if (options.cloneSchema && !cloned) {
            cloned = true;
            schema[struct] = schema[struct].slice();
          }

          schema[struct].splice(j, 1);
          j--;
          continue;
        }

        schema[struct][j] = convertSchema(schema[struct][j], options);
      }
    } else if (schema[struct] === null) {
      delete schema[struct];
    } else if (typeof schema[struct] === "object") {
      schema[struct] = convertSchema(schema[struct], options);
    }
  }
  let convertedSchema = schema as SchemaObject;

  for (const def of definitionKeywords) {
    const innerDef = get(schema, def);
    if (typeof innerDef === "object") {
      const convertedInnerDef = convertProperties(innerDef, options);
      set(schema, def, convertedInnerDef);
    }
  }

  if ("properties" in convertedSchema) {
    convertedSchema.properties = convertProperties(convertedSchema.properties, options);

    if (Array.isArray(convertedSchema.required)) {
      convertedSchema.required = convertedSchema.required.filter(
        (key) => "properties" in convertedSchema && convertedSchema.properties?.[key] !== undefined,
      );
      if (convertedSchema.required.length === 0) {
        delete convertedSchema.required;
      }
    }
    if (Object.keys(convertedSchema.properties).length === 0) {
      delete convertedSchema.properties;
    }
  }

  if (strictMode && "type" in convertedSchema) {
    validateType(convertedSchema.type);
  }

  convertTypes(convertedSchema);
  convertFormat(convertedSchema, options);

  if ("x-patternProperties" in convertedSchema && options.supportPatternProperties) {
    convertedSchema = convertPatternProperties(convertedSchema, options.patternPropertiesHandler);
  }

  for (const item of notSupported) {
    delete convertedSchema[item];
  }

  if (afterTransform) {
    return afterTransform(convertedSchema, options);
  }

  return convertedSchema as JSONSchema4;
}

const validTypes = ["integer", "number", "string", "boolean", "object", "array", "null"] as const;
function validateType(type: unknown) {
  if (type && !(validTypes as ReadonlyArray<unknown>).includes(type)) {
    throw new InvalidTypeError(`Type ${JSON.stringify(type)} is not a valid type`);
  }
}

function convertProperties(
  properties: Record<string, ReferenceObject | SchemaObject> | undefined,
  options: OptionsInternal,
) {
  let key;
  const props = {};
  let removeProp;

  if (!isObject(properties) || !properties) {
    return props;
  }

  for (key in properties) {
    const property = properties[key];

    if (!isObject(property)) {
      continue;
    }

    removeProp = options._removeProps.some((prop) => property[prop] === true);

    if (removeProp) {
      continue;
    }

    props[key] = convertSchema(property, options);
  }

  return props;
}

function convertTypes(schema: SchemaObject) {
  if ("type" in schema) {
    const type = schema.type as JSONSchema4TypeName;
    const schemaEnum = schema.enum as (string | null)[];
    if (type !== undefined && schema.nullable === true) {
      (<JSONSchema4>schema).type = [type, "null"];
      if (Array.isArray(schemaEnum) && !schemaEnum.includes(null)) {
        // @ts-ignore
        schema.enum = schemaEnum.concat([null]);
      }
    }
  }

  return schema;
}

const formatConverters = {
  int32: convertFormatInt32,
  int64: convertFormatInt64,
  float: convertFormatFloat,
  double: convertFormatDouble,
  byte: convertFormatByte,
} as const;

function convertFormat(schema: SchemaObject | JSONSchema4, { dateToDateTime }: OptionsInternal) {
  const format = schema.format;
  const settings = {
    MIN_INT_32: 0 - 2 ** 31,
    MAX_INT_32: 2 ** 31 - 1,
    MIN_INT_64: 0 - 2 ** 63,
    MAX_INT_64: 2 ** 63 - 1,
    MIN_FLOAT: 0 - 2 ** 128,
    MAX_FLOAT: 2 ** 128 - 1,
    MIN_DOUBLE: 0 - Number.MAX_VALUE,
    MAX_DOUBLE: Number.MAX_VALUE,

    // Matches base64 (RFC 4648)
    // Matches `standard` base64 not `base64url`. The specification does not
    // exclude it but current ongoing OpenAPI plans will distinguish btoh.
    BYTE_PATTERN: "^[\\w\\d+\\/=]*$",
  };

  if (format === undefined || VALID_OPENAPI_FORMATS.includes(format)) {
    return schema;
  }

  if (format === "date" && dateToDateTime === true) {
    return convertFormatDate(schema);
  }

  const converter = formatConverters[format];

  if (!converter) {
    return schema;
  }

  return converter(schema, settings);
}

function convertFormatInt32(schema: JSONSchema4, { MIN_INT_32, MAX_INT_32 }) {
  if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < MIN_INT_32) {
    schema.minimum = MIN_INT_32;
  }
  if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > MAX_INT_32) {
    schema.maximum = MAX_INT_32;
  }
  return schema;
}

function convertFormatInt64(
  schema: JSONSchema4,
  { MIN_INT_64, MAX_INT_64 }: { MIN_INT_64: number; MAX_INT_64: number },
) {
  if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < MIN_INT_64) {
    schema.minimum = MIN_INT_64;
  }
  if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > MAX_INT_64) {
    schema.maximum = MAX_INT_64;
  }
  return schema;
}

function convertFormatFloat(schema: JSONSchema4, { MIN_FLOAT, MAX_FLOAT }: { MIN_FLOAT: number; MAX_FLOAT: number }) {
  if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < MIN_FLOAT) {
    schema.minimum = MIN_FLOAT;
  }
  if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > MAX_FLOAT) {
    schema.maximum = MAX_FLOAT;
  }
  return schema;
}

function convertFormatDouble(
  schema: JSONSchema4,
  { MIN_DOUBLE, MAX_DOUBLE }: { MIN_DOUBLE: number; MAX_DOUBLE: number },
) {
  if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < MIN_DOUBLE) {
    schema.minimum = MIN_DOUBLE;
  }
  if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > MAX_DOUBLE) {
    schema.maximum = MAX_DOUBLE;
  }
  return schema;
}

function convertFormatDate(schema: SchemaObject | JSONSchema4) {
  schema.format = "date-time";
  return schema;
}

function convertFormatByte(schema: JSONSchema4, { BYTE_PATTERN }: { BYTE_PATTERN: string }) {
  schema.pattern = BYTE_PATTERN;
  return schema;
}

function convertPatternProperties(schema: SchemaObject, handler: PatternPropertiesHandler) {
  if (isObject(schema["x-patternProperties"])) {
    (<JSONSchema4>schema).patternProperties = schema["x-patternProperties"];
  }

  delete schema["x-patternProperties"];

  return handler(schema);
}

export default convertFromSchema;
