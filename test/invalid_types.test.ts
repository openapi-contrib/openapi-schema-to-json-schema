import { getSchema } from "./helpers";
import convert from "../src";

it("invalid types", async ({ expect }) => {
  expect(() => {
    convert({
      type: "dateTime",
    });
  }).toThrow("is not a valid type");

  expect(() => {
    convert({
      type: "foo",
    });
  }).toThrow("is not a valid type");

  expect(() => {
    convert({
      type: ["string", null],
    });
  }).toThrow("is not a valid type");

  expect(() => {
    convert(getSchema("schema-2-invalid-type.json"));
  }).toThrow("is not a valid type");
});

it("valid types", async ({ expect }) => {
  const types = ["integer", "number", "string", "boolean", "object", "array", "null"];

  types.forEach((type) => {
    const result = convert({
      type,
    });

    const expected = {
      $schema: "http://json-schema.org/draft-04/schema#",
      type,
    };

    expect(result).toEqual(expected);
  });

  it("invalid type allowed when strictMode = false", async ({ expect }) => {
    const schema = {
      type: "nonsense",
    };

    const result = convert(schema, { strictMode: false });

    const expected = {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "nonsense",
    };

    expect(result).toEqual(expected);
  });
});
