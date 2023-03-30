export const NOT_SUPPORTED = [
  "nullable",
  "discriminator",
  "readOnly",
  "writeOnly",
  "xml",
  "externalDocs",
  "example",
  "deprecated",
] as const;
export const STRUCTS = ["allOf", "anyOf", "oneOf", "not", "items", "additionalProperties"] as const;
// Valid JSON schema v4 formats
export const VALID_OPENAPI_FORMATS = ["date-time", "email", "hostname", "ipv4", "ipv6", "uri", "uri-reference"];
