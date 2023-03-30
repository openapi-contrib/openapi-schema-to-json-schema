import convert from "../src";

it("handles conversion in keywords specified in additionalKeywords", function ({ expect }) {
  const schema = {
    type: "boolean",
  };

  const result = convert(schema, {
    beforeTransform: function (schema) {
      schema.type = "string";
      return schema;
    },
    afterTransform: function (schema) {
      schema.examples = ["foo", "bar"];
      return schema;
    },
  });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
    examples: ["foo", "bar"],
  };

  expect(result).toEqual(expected);
});
