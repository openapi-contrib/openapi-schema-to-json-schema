import convert from "../src";

it("plain string is untouched", async ({ expect }) => {
  const schema = {
    type: "string",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
  };

  expect(result).toEqual(expected);
});

it("handles date", async ({ expect }) => {
  const schema = {
    type: "string",
    format: "date",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
    format: "date",
  };

  expect(result).toEqual(expected);

  {
    const schema = {
      type: "string",
      format: "date",
    };

    const result = convert(schema, { dateToDateTime: true });

    const expected = {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "string",
      format: "date-time",
    };

    expect(result).toEqual(expected);
  }
});

it("handles byte format", async ({ expect }) => {
  const schema = {
    type: "string",
    format: "byte",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
    format: "byte",
    pattern: "^[\\w\\d+\\/=]*$",
  };

  expect(result).toEqual(expected);
});

it("retaining custom formats", async ({ expect }) => {
  const schema = {
    type: "string",
    format: "custom_email",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
    format: "custom_email",
  };

  expect(result).toEqual(expected);
});

it("retain password format", async ({ expect }) => {
  const schema = {
    type: "string",
    format: "password",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
    format: "password",
  };

  expect(result).toEqual(expected);
});

it("retain binary format", async ({ expect }) => {
  const schema = {
    type: "string",
    format: "binary",
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
    format: "binary",
  };

  expect(result).toEqual(expected);
});
