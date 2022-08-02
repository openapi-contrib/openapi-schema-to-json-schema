import convert from "../src";

it("properties", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["bar"],
    properties: {
      foo: {
        type: "string",
        example: "2017-01-01T12:34:56Z",
      },
      bar: {
        type: "string",
        nullable: true,
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["bar"],
    properties: {
      foo: {
        type: "string",
      },
      bar: {
        type: ["string", "null"],
      },
    },
  };

  expect(result).toEqual(expected);
});

it("properties value is null", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: null,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
  };

  expect(result).toEqual(expected);
});

it("strips malformed properties children", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["bar"],
    properties: {
      foo: {
        type: "string",
        example: "2017-01-01T12:34:56Z",
      },
      foobar: 2,
      bar: {
        type: "string",
        nullable: true,
      },
      baz: null,
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["bar"],
    properties: {
      foo: {
        type: "string",
      },
      bar: {
        type: ["string", "null"],
      },
    },
  };

  expect(result).toEqual(expected);
});

it("additionalProperties is false", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      foo: {
        type: "string",
        example: "2017-01-01T12:34:56Z",
      },
    },
    additionalProperties: false,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      foo: {
        type: "string",
      },
    },
    additionalProperties: false,
  };

  expect(result).toEqual(expected);
});

it("additionalProperties is true", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      foo: {
        type: "string",
        example: "2017-01-01T12:34:56Z",
      },
    },
    additionalProperties: true,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      foo: {
        type: "string",
      },
    },
    additionalProperties: true,
  };

  expect(result).toEqual(expected);
});

it("additionalProperties is an object", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      foo: {
        type: "string",
        example: "2017-01-01T12:34:56Z",
      },
    },
    additionalProperties: {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      foo: {
        type: "string",
      },
    },
    additionalProperties: {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
      },
    },
  };

  expect(result).toEqual(expected);
});
