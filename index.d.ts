declare namespace OpenapiSchemaToJsonSchema {
  interface Options {
    dateToDateTime?: boolean;
    cloneSchema?: boolean;
    supportPatternProperties?: boolean;
    keepNotSupported?: NotSupported[];
    strictMode?: boolean;
  }
  type NotSupported =
    | "nullable"
    | "discriminator"
    | "readOnly"
    | "writeOnly"
    | "xml"
    | "externalDocs"
    | "example"
    | "deprecated";

  function fromSchema<T = Record<string | number, any>>(
    schema: Record<string | number, any>,
    options?: Options
  ): T;
  function fromParameter<T = Record<string | number, any>>(
    parameter: Record<string | number, any>,
    options?: Options
  ): T;
}
declare function OpenapiSchemaToJsonSchema<T = Record<string | number, any>>(
  schema: Record<string | number, any>,
  options?: OpenapiSchemaToJsonSchema.Options
): T;
export = OpenapiSchemaToJsonSchema;
