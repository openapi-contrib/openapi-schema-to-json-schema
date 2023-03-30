import convert from "../src";

it("remove discriminator by default", async ({ expect }) => {
  const schema = {
    oneOf: [
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "string",
          },
        },
      },
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "string",
          },
        },
      },
    ],
    discriminator: {
      propertyName: "foo",
    },
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
            type: "string",
          },
        },
      },
      {
        type: "object",
        required: ["foo"],
        properties: {
          foo: {
            type: "string",
          },
        },
      },
    ],
  };

  expect(result).toEqual(expected);
});

it("remove readOnly by default", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      readOnly: {
        type: "string",
        readOnly: true,
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      readOnly: {
        type: "string",
      },
    },
  };
  expect(result).toEqual(expected);
});

it("remove writeOnly by default", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      test: {
        type: "string",
        writeOnly: true,
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      test: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("remove xml by default", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      foo: {
        type: "string",
        xml: {
          attribute: true,
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
  };

  expect(result).toEqual(expected);
});

it("remove externalDocs by default", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      foo: {
        type: "string",
      },
    },
    externalDocs: {
      url: "http://foo.bar",
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
  };

  expect(result).toEqual(expected);
});

it("remove example by default", async ({ expect }) => {
  const schema = {
    type: "string",
    example: "foo",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
  };

  expect(result).toEqual(expected);
});

it("remove deprecated by default", async ({ expect }) => {
  const schema = {
    type: "string",
    deprecated: true,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
  };

  expect(result).toEqual(expected);
});

it("retaining fields", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      readOnly: {
        type: "string",
        readOnly: true,
        example: "foo",
      },
      anotherProp: {
        type: "object",
        properties: {
          writeOnly: {
            type: "string",
            writeOnly: true,
          },
        },
      },
    },
    discriminator: "bar",
  };

  const result = convert(schema, { keepNotSupported: ["readOnly", "discriminator"] });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      readOnly: {
        type: "string",
        readOnly: true,
      },
      anotherProp: {
        type: "object",
        properties: {
          writeOnly: {
            type: "string",
          },
        },
      },
    },
    discriminator: "bar",
  };

  expect(result).toEqual(expected);
});
