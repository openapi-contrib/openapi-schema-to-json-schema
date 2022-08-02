import convert from "../src";

it("iterates allOfs", async ({ expect }) => {
  const schema = {
    allOf: [
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "integer",
          },
        },
      },
      {
        allOf: [
          {
            type: "number",
          },
        ],
      },
    ],
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    allOf: [
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "integer",
          },
        },
      },
      {
        allOf: [
          {
            type: "number",
          },
        ],
      },
    ],
  };

  expect(result).toEqual(expected);
});

it("iterates anyOfs", async ({ expect }) => {
  const schema = {
    anyOf: [
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "integer",
          },
        },
      },
      {
        anyOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "number",
              },
            },
          },
        ],
      },
    ],
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    anyOf: [
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "integer",
          },
        },
      },
      {
        anyOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "number",
              },
            },
          },
        ],
      },
    ],
  };

  expect(result).toEqual(expected);
});

it("iterates oneOfs", async ({ expect }) => {
  const schema = {
    oneOf: [
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "integer",
          },
        },
      },
      {
        oneOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "number",
              },
            },
          },
        ],
      },
    ],
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    oneOf: [
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "integer",
          },
        },
      },
      {
        oneOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "number",
              },
            },
          },
        ],
      },
    ],
  };

  expect(result).toEqual(expected);
});

it("converts types in not", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      not: {
        type: "string",
        minLength: 8,
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      not: {
        type: "string",
        minLength: 8,
      },
    },
  };

  expect(result).toEqual(expected);
});

it("converts types in not", async ({ expect }) => {
  const schema = {
    not: {
      type: "string",
      minLength: 8,
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    not: {
      type: "string",
      minLength: 8,
    },
  };

  expect(result).toEqual(expected);
});

it("nested combination keywords", async ({ expect }) => {
  const schema = {
    anyOf: [
      {
        allOf: [
          {
            type: "object",
            properties: {
              foo: {
                type: "string",
                nullable: true,
              },
            },
          },
          {
            type: "object",
            properties: {
              bar: {
                type: "integer",
                nullable: true,
              },
            },
          },
        ],
      },
      {
        type: "object",
        properties: {
          foo: {
            type: "string",
          },
        },
      },
      {
        not: {
          type: "string",
          example: "foobar",
        },
      },
    ],
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    anyOf: [
      {
        allOf: [
          {
            type: "object",
            properties: {
              foo: {
                type: ["string", "null"],
              },
            },
          },
          {
            type: "object",
            properties: {
              bar: {
                type: ["integer", "null"],
              },
            },
          },
        ],
      },
      {
        type: "object",
        properties: {
          foo: {
            type: "string",
          },
        },
      },
      {
        not: {
          type: "string",
        },
      },
    ],
  };

  expect(result).toEqual(expected);
});
