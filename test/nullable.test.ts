import convert from "../src";

it("handles nullable without enum", async ({ expect }) => {
  const schema = {
    type: "string",
    nullable: true,
  };

  const result = convert(schema);

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
  };

  expect(result).toEqual(expected);

  {
    const schema = {
      type: "string",
      nullable: false,
    };

    const result = convert(schema);

    const expected = {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "string",
    };

    expect(result).toEqual(expected);
  }
});

it("handles nullable with enum", async ({ expect }) => {
  const result = convert({
    type: "string",
    enum: ["a", "b"],
    nullable: true,
  });

  const expected = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
    enum: ["a", "b", null],
  };

  expect(result).toEqual(expected);

  const resultTwo = convert({
    type: "string",
    enum: ["a", "b", null],
    nullable: true,
  });

  const expectedTwo = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: ["string", "null"],
    enum: ["a", "b", null],
  };

  expect(resultTwo).toEqual(expectedTwo);
  const resultThree = convert({
    type: "string",
    enum: ["a", "b"],
    nullable: false,
  });

  const expectedThree = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "string",
    enum: ["a", "b"],
  };
  expect(resultThree).toEqual(expectedThree);
});
