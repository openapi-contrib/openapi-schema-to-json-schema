import convert from "../src";

it("items", async ({ expect }) => {
  const schema = {
    type: "array",
    items: {
      type: "string",
      example: "2017-01-01T12:34:56Z",
    },
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "array",
    items: {
      type: "string",
    },
  };

  expect(result).toEqual(expected);
});

it("handles items with invalid values", async ({ expect }) => {
  const schema = {
    type: "array",
    items: [
      {
        type: "string",
      },
      2,
      null,
      {
        type: "number",
      },
      "foo",
      {
        type: "array",
      },
    ],
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "array",
    items: [
      {
        type: "string",
      },
      {
        type: "number",
      },
      {
        type: "array",
      },
    ],
  };

  expect(result).toEqual(expected);
});
