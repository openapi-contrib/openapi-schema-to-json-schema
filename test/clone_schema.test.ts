import convert from "../src";

it("cloning schema by default", async ({ expect }) => {
  const schema = {
    type: "string",
    nullable: true,
    properties: {
      foo: true,
      bar: {
        allOf: [
          null,
          {
            type: "string",
          },
          null,
        ],
      },
    },
  };

  const cloned = JSON.parse(JSON.stringify(schema));

  const result = convert(cloned);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
    properties: {
      bar: {
        allOf: [
          {
            type: "string",
          },
        ],
      },
    },
  };

  expect(result).toEqual(expected);
  expect(cloned).toEqual(schema);
});

it("cloning schema with cloneSchema option", async ({ expect }) => {
  const schema = {
    type: "string",
    nullable: true,
  };

  const cloned = JSON.parse(JSON.stringify(schema));

  const result = convert(schema, { cloneSchema: true });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
  };

  expect(result).toEqual(expected);
  expect(cloned).toEqual(schema);
});

it("handles circular references", async ({ expect }) => {
  const a: Record<string, object> = {};

  a.a = a;

  const schema = {
    type: "string",
    nullable: true,
    a,
  };

  const result = convert(schema, { cloneSchema: true });
  expect(result).not.toEqual(schema);
});

it("direct schema modification", async ({ expect }) => {
  const schema = {
    type: "string",
    nullable: true,
  };

  const result = convert(schema, { cloneSchema: false });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
  };

  expect(result).toEqual(expected);
  expect(result).toEqual(schema);
});
