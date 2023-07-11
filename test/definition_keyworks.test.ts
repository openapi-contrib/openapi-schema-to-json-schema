import convert from "../src";

describe("handles conversion in keywords specified in additionalKeywords", function () {
  const schema = {
    definitions: {
      sharedDefinition: {
        type: "object",
        properties: {
          foo: {
            type: "string",
            nullable: true,
          },
        },
      },
    },
  };

  it("handles conversion in keywords specified in additionalKeywords", function ({ expect }) {
    const result = convert(schema, {
      definitionKeywords: ["definitions"],
    });

    const expected = {
      $schema: "http://json-schema.org/draft-04/schema#",
      definitions: {
        sharedDefinition: {
          type: "object",
          properties: {
            foo: {
              type: ["string", "null"],
            },
          },
        },
      },
    };

    expect(result).toEqual(expected);
  });

  it("does not convert when no definition keywords are included", function ({ expect }) {
    const result = convert(schema);

    const expected = {
      $schema: "http://json-schema.org/draft-04/schema#",
      definitions: {
        sharedDefinition: {
          properties: {
            foo: {
              nullable: true,
              type: "string",
            },
          },
          type: "object",
        },
      },
    };

    expect(result).toEqual(expected);
  });

  it("handles nested definition keywords", function ({ expect }) {
    const nestedSchema = {
      schema: {
        definitions: {
          sharedDefinition: {
            type: "object",
            properties: {
              foo: {
                type: "string",
                nullable: true,
              },
            },
          },
        },
      },
    };
    const result = convert(nestedSchema, { definitionKeywords: ["schema.definitions"] });

    const expected = {
      $schema: "http://json-schema.org/draft-04/schema#",
      schema: {
        definitions: {
          sharedDefinition: {
            type: "object",
            properties: {
              foo: {
                type: ["string", "null"],
              },
            },
          },
        },
      },
    };

    expect(result).toEqual(expected);
  });
});
