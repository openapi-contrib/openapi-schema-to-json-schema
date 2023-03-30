import * as convert from "../src";

it("converting a minimal OpenAPI 3.0 parameter", async ({ expect }) => {
  const schema = {
    name: "parameter name",
    in: "cookie",
    schema: {
      type: "string",
      nullable: true,
    },
  };

  const result = convert.fromParameter(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
  };

  expect(result).toEqual(expected);
});

it("converting an extensive OpenAPI 3.0 parameter", async ({ expect }) => {
  const schema = {
    name: "parameter name",
    in: "cookie",
    schema: {
      type: "string",
      nullable: true,
    },
    required: true,
    allowEmptyValue: true,
    deprecated: true,
    allowReserved: true,
    style: "matrix",
    explode: true,
    example: "parameter example",
  };

  const result = convert.fromParameter(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
  };

  expect(result).toEqual(expected);
});

it("converting a OpenAPI 3.0 parameter with MIME schemas", async ({ expect }) => {
  const schema = {
    name: "parameter name",
    in: "cookie",
    content: {
      "application/javascript": {
        schema: {
          type: "string",
          nullable: true,
        },
      },
      "text/css": {
        schema: {
          type: "string",
          nullable: true,
        },
      },
    },
  };

  const result = convert.fromParameter(schema);

  const expected = {
    "application/javascript": {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: ["string", "null"],
    },
    "text/css": {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: ["string", "null"],
    },
  };

  expect(result).toEqual(expected);
});

it("converting a OpenAPI 3.0 parameter with MIMEs without a schema", async ({ expect }) => {
  const schema = {
    name: "parameter name",
    in: "cookie",
    content: {
      "application/javascript": {
        schema: {
          type: "string",
          nullable: true,
        },
      },
      "text/css": {},
    },
  };

  const result = convert.fromParameter(schema);

  const expected = {
    "application/javascript": {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: ["string", "null"],
    },
    "text/css": {
      $schema: "http://json-schema.org/draft-04/schema#",
    },
  };

  expect(result).toEqual(expected);
});

it("using a OpenAPI 3.0 parameter description", async ({ expect }) => {
  const schema = {
    name: "parameter name",
    in: "cookie",
    description: "parameter description",
    schema: {
      description: "schema description",
    },
  };

  const result = convert.fromParameter(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    description: "parameter description",
  };

  expect(result).toEqual(expected);
});

it("throwing on OpenAPI 3.0 parameters without schemas", async ({ expect }) => {
  const schema = {
    name: "parameter name",
    in: "cookie",
  };

  expect(() => {
    convert.fromParameter(schema);
  }).toThrow("parameter must have either a");
});

it("doesnt throw for parameters without schemas with stricMode disabled", async ({ expect }) => {
  const schema = {
    name: "parameter name",
    in: "cookie",
  };

  const result = convert.fromParameter(schema, { strictMode: false });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
  };

  expect(result).toEqual(expected);
});
