import { fromSchema } from "../src";

it("using exports.fromSchema", async ({ expect }) => {
  const schema = {
    type: "string",
    nullable: true,
  };

  const result = fromSchema(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
  };

  expect(result).toEqual(expected);
});
