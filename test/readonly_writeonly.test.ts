import convert from "../src";

it("removing readOnly prop", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      prop1: {
        type: "string",
        readOnly: true,
      },
      prop2: {
        type: "string",
      },
    },
  };

  const result = convert(schema, { removeReadOnly: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      prop2: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("removing readOnly prop even if keeping", async ({ expect }) => {
  const schema = {
    type: "object",
    properties: {
      prop1: {
        type: "string",
        readOnly: true,
      },
      prop2: {
        type: "string",
      },
    },
  };

  const result = convert(schema, {
    removeReadOnly: true,
    keepNotSupported: ["readOnly"],
  });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      prop2: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("removing writeOnly prop & required", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["prop1", "prop2", "prop3", "prop4"],
    properties: {
      prop1: {
        type: "string",
        writeOnly: true,
      },
      prop2: {
        type: "string",
        writeOnly: true,
      },
      prop3: {
        type: "string",
        writeOnly: true,
      },
      prop4: {
        type: "string",
      },
    },
  };

  const result = convert(schema, { removeWriteOnly: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["prop4"],
    properties: {
      prop4: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("removing readOnly from required", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["prop1", "prop2", "prop3", "prop4"],
    properties: {
      prop1: {
        type: "string",
      },
      prop2: {
        type: "string",
        readOnly: true,
      },
      prop3: {
        type: "string",
        readOnly: true,
      },
      prop4: {
        type: "string",
      },
    },
  };

  const result = convert(schema, { removeReadOnly: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["prop1", "prop4"],
    properties: {
      prop1: {
        type: "string",
      },
      prop4: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("deleting required if empty", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["prop1"],
    properties: {
      prop1: {
        type: "string",
        readOnly: true,
      },
      prop2: {
        type: "string",
      },
    },
  };

  const result = convert(schema, { removeReadOnly: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      prop2: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("deleting properties if empty", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["prop1"],
    properties: {
      prop1: {
        type: "string",
        readOnly: true,
      },
    },
  };

  const result = convert(schema, { removeReadOnly: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
  };

  expect(result).toEqual(expected);
});

it("not removing readOnly props by default", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["prop1", "prop2"],
    properties: {
      prop1: {
        type: "string",
        readOnly: true,
      },
      prop2: {
        type: "string",
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["prop1", "prop2"],
    properties: {
      prop1: {
        type: "string",
      },
      prop2: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("not removing writeOnly props by default", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["prop1", "prop2"],
    properties: {
      prop1: {
        type: "string",
        writeOnly: true,
      },
      prop2: {
        type: "string",
      },
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["prop1", "prop2"],
    properties: {
      prop1: {
        type: "string",
      },
      prop2: {
        type: "string",
      },
    },
  };

  expect(result).toEqual(expected);
});

it("deep schema", async ({ expect }) => {
  const schema = {
    type: "object",
    required: ["prop1", "prop2"],
    properties: {
      prop1: {
        type: "string",
        readOnly: true,
      },
      prop2: {
        allOf: [
          {
            type: "object",
            required: ["prop3"],
            properties: {
              prop3: {
                type: "object",
                readOnly: true,
              },
            },
          },
          {
            type: "object",
            properties: {
              prop4: {
                type: "object",
                readOnly: true,
              },
            },
          },
        ],
      },
    },
  };

  const result = convert(schema, { removeReadOnly: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["prop2"],
    properties: {
      prop2: {
        allOf: [
          {
            type: "object",
          },
          {
            type: "object",
          },
        ],
      },
    },
  };

  expect(result).toEqual(expected);
});
