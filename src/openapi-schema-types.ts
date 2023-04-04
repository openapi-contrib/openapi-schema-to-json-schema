import type { NOT_SUPPORTED, STRUCTS } from "./consts";
import type { OpenAPI3 } from "openapi-typescript";
import type { SchemaObject } from "openapi-typescript/src/types";
import type { ReferenceObject } from "openapi-typescript/src/types";
import type { JSONSchema4 } from "json-schema";
export type { OpenAPI3 };
// We don't know what the shape of the object looks like when it's passed in, but we know its some mix of these two
export type PatternPropertiesHandler = (schema: SchemaObject) => SchemaObject;
export type AcceptibleInputSchema = SchemaObject | OpenAPI3 | Record<string, any>;

export interface Options {
  dateToDateTime?: boolean;
  cloneSchema?: boolean;
  supportPatternProperties?: boolean;
  keepNotSupported?: (typeof NOT_SUPPORTED)[number][];
  strictMode?: boolean;
  removeReadOnly?: boolean;
  removeWriteOnly?: boolean;
  patternPropertiesHandler?: PatternPropertiesHandler;
  definitionKeywords?: string[];
  beforeTransform?: (schema: SchemaObject | ReferenceObject | OpenAPI3, options: Options) => SchemaObject;
  afterTransform?: (schema: SchemaObject | ReferenceObject | OpenAPI3, options: Options) => JSONSchema4;
}

export interface OptionsInternal extends Options {
  _removeProps: string[];
  _structs: typeof STRUCTS;
  _notSupported: (typeof NOT_SUPPORTED)[number][];
  patternPropertiesHandler: PatternPropertiesHandler;
}
