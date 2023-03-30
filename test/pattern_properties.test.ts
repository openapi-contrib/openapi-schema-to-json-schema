import convert from "../src";

it("handling additional properties of the same type: string", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "string",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("handling additional properties of the same type: number", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "number",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "number",
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z]*$": {
        type: "number",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("handling additional properties with one of patternProperty types", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "number",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "number",
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "number",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("handling additionalProperties with matching objects", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        test: {
          type: "string",
        },
      },
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
    },
  };

  expect(result).toEqual(expected);
});

it("handling null x-patternProperties", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        test: {
          type: "string",
        },
      },
    },
    "x-patternProperties": null,
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        test: {
          type: "string",
        },
      },
    },
  };

  expect(result["x-patternProperties"]).toEqual(void 0);
  expect(result).toEqual(expected);
});

it("handling additionalProperties with non-matching objects", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        test: {
          type: "string",
        },
      },
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "object",
        properties: {
          test: {
            type: "integer",
          },
        },
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        test: {
          type: "string",
        },
      },
    },
    patternProperties: {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "object",
        properties: {
          test: {
            type: "integer",
          },
        },
      },
    },
  };

  expect(result).toEqual(expected);
});

it("handling additionalProperties with matching array", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "array",
      items: {
        type: "string",
      },
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z]*$": {
        type: "string",
      },
      "^[A-Z]*$": {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  };

  expect(result).toEqual(expected);
});

it("handling additionalProperties with composition types", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      oneOf: [
        {
          type: "string",
        },
        {
          type: "integer",
        },
      ],
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "integer",
          },
        ],
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z]*$": {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "integer",
          },
        ],
      },
    },
  };

  expect(result).toEqual(expected);
});

it("not supporting patternProperties", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "string",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: false });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: {
      type: "string",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("not supporting patternProperties by default", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "string",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: {
      type: "string",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("setting custom patternProperties handler", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: {
      type: "string",
    },
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  const result = convert(schema, {
    supportPatternProperties: true,
    patternPropertiesHandler: function (schema) {
      schema.patternProperties = false;
      return schema;
    },
  });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: {
      type: "string",
    },
    patternProperties: false,
  };

  expect(result).toEqual(expected);
});

it("additionalProperties not modified if set to true", async ({ expect }) => {
  const schema = {
    type: "object",
    additionalProperties: true,
    "x-patternProperties": {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  const result = convert(schema, { supportPatternProperties: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    additionalProperties: true,
    patternProperties: {
      "^[a-z]*$": {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});
