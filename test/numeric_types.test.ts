import convert from "../src";

it("handles int32 format", async ({ expect }) => {
  const schema = {
    type: "integer",
    format: "int32",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int32",
    minimum: 0 - Math.pow(2, 31),
    maximum: Math.pow(2, 31) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles int32 format with specified minimum", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int32",
    minimum: 500,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int32",
    minimum: 500,
    maximum: Math.pow(2, 31) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles int32 format with specified minimum that's too small", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int32",
    minimum: -Math.pow(2, 32),
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int32",
    minimum: 0 - Math.pow(2, 31),
    maximum: Math.pow(2, 31) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles int32 format with specified maximum", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int32",
    maximum: 500,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int32",
    minimum: 0 - Math.pow(2, 31),
    maximum: 500,
  };

  expect(result).toEqual(expected);
});

test("handles int32 format with specified minimum that's too big", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int32",
    maximum: Math.pow(2, 32),
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int32",
    minimum: 0 - Math.pow(2, 31),
    maximum: Math.pow(2, 31) - 1,
  };

  expect(result).toEqual(expected);
});

it("handles int64 format", async ({ expect }) => {
  const schema = {
    type: "integer",
    format: "int64",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int64",
    minimum: 0 - Math.pow(2, 63),
    maximum: Math.pow(2, 63) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles int64 format with specified minimum", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int64",
    minimum: 500,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int64",
    minimum: 500,
    maximum: Math.pow(2, 63) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles int64 format with specified minimum that's too small", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int64",
    minimum: -Math.pow(2, 64),
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int64",
    minimum: 0 - Math.pow(2, 63),
    maximum: Math.pow(2, 63) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles int64 format with specified maximum", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int64",
    maximum: 500,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int64",
    minimum: 0 - Math.pow(2, 63),
    maximum: 500,
  };

  expect(result).toEqual(expected);
});

test("handles int64 format with specified minimum that's too big", async function ({ expect }) {
  const schema = {
    type: "integer",
    format: "int64",
    maximum: Math.pow(2, 64),
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "integer",
    format: "int64",
    minimum: 0 - Math.pow(2, 63),
    maximum: Math.pow(2, 63) - 1,
  };

  expect(result).toEqual(expected);
});

it("handles float format", async ({ expect }) => {
  const schema = {
    type: "number",
    format: "float",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "float",
    minimum: 0 - Math.pow(2, 128),
    maximum: Math.pow(2, 128) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles float format with specified minimum", async function ({ expect }) {
  const schema = {
    type: "number",
    format: "float",
    minimum: 500,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "float",
    minimum: 500,
    maximum: Math.pow(2, 128) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles float format with specified minimum that's too small", async function ({ expect }) {
  const schema = {
    type: "number",
    format: "float",
    minimum: -Math.pow(2, 129),
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "float",
    minimum: 0 - Math.pow(2, 128),
    maximum: Math.pow(2, 128) - 1,
  };

  expect(result).toEqual(expected);
});

test("handles float format with specified maximum", async function ({ expect }) {
  const schema = {
    type: "number",
    format: "float",
    maximum: 500,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "float",
    minimum: 0 - Math.pow(2, 128),
    maximum: 500,
  };

  expect(result).toEqual(expected);
});

test("handles float format with specified minimum that's too big", async function ({ expect }) {
  const schema = {
    type: "number",
    format: "float",
    maximum: Math.pow(2, 129),
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "float",
    minimum: 0 - Math.pow(2, 128),
    maximum: Math.pow(2, 128) - 1,
  };

  expect(result).toEqual(expected);
});

it("handles double format", async ({ expect }) => {
  const schema = {
    type: "number",
    format: "double",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "double",
    minimum: 0 - Number.MAX_VALUE,
    maximum: Number.MAX_VALUE,
  };

  expect(result).toEqual(expected);
});

test("handles double format with specified minimum", async function ({ expect }) {
  const schema = {
    type: "number",
    format: "double",
    minimum: 50.5,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "double",
    minimum: 50.5,
    maximum: Number.MAX_VALUE - 1,
  };

  expect(result).toEqual(expected);
});

test("handles double format with specified maximum", async function ({ expect }) {
  const schema = {
    type: "number",
    format: "double",
    maximum: 50.5,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "number",
    format: "double",
    minimum: 0 - Number.MAX_VALUE,
    maximum: 50.5,
  };

  expect(result).toEqual(expected);
});
