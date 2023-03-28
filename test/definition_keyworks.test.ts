import convert from "../src";

it("handles conversion in keywords specified in additionalKeywords", function ({ expect }) {
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
