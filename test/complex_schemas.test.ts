import { getSchema } from "./helpers";
import convert from "../src";

it("complex schema", async ({ expect }) => {
  const schema = getSchema("schema-1.json");
  const result = convert(schema);
  const expected = getSchema("schema-1-expected.json");

  expect(result).toEqual(expected);
});

it("converting complex schema in place", async ({ expect }) => {
  const schema = getSchema("schema-1.json");
  const result = convert(schema, { cloneSchema: false });
  const expected = getSchema("schema-1-expected.json");

  expect(schema).toEqual(result);
  expect(result).toEqual(expected);
});
