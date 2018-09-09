# OpenAPI Schema to JSON Schema

A little NodeJS package to convert OpenAPI Schema Object or Parameter Object to JSON Schema.

Currently converts from [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) to [JSON Schema Draft 4](http://json-schema.org/specification-links.html#draft-4).

## Why?

OpenAPI is a specification for describing RESTful APIs. OpenAPI 3.0 allows us to describe the structures of request and response payloads in a detailed manner. This would, theoretically, mean that we should be able to automatically validate request and response payloads. However, as of writing there aren't many validators around.

The good news is that there are many validators for JSON Schema for different languages. The bad news is that OpenAPI 3.0 is not entirely compatible with JSON Schema. The Schema Object of OpenAPI 3.0 is an extended subset of JSON Schema Specification Wright Draft 00 with some differences.

The purpose of this project is to fill the gap by doing the conversion between these two formats.

There is also a [CLI tool](https://github.com/mikunn/openapi2schema) for creating a JSON of schemas from the whole API specification.

If you need to do the conversion in reverse, checkout [json-schema-to-openapi-schema](https://github.com/philsturgeon/json-schema-to-openapi-schema).

## Features

* converts OpenAPI 3.0 Schema Object to JSON Schema Draft 4
* converts OpenAPI 3.0 Parameter Object to JSON Schema Draft 4
* ~~converts [common named data types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#data-types) to `type` and `format`~~ *(removed in version 2.0.0)*
  * ~~for example `type: "dateTime"` becomes `type: "string"` with `format: "date-time"`~~
* deletes `nullable` and adds `"null"` to `type` array if `nullable` is `true`
* supports deep structures with nested `allOf`s etc.
* removes [OpenAPI specific properties](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#fixed-fields-20) such as `discriminator`, `deprecated` etc. unless specified otherwise
* optionally supports `patternProperties` with `x-patternProperties` in the Schema Object

**NOTE**: `$ref`s are not dereferenced. Use a dereferencer such as [json-schema-ref-parser](https://www.npmjs.com/package/json-schema-ref-parser) prior to using this package.

## Installation

```
npm install --save openapi-schema-to-json-schema
```

## Converting OpenAPI schema

Here's a small example to get the idea:

```js

var toJsonSchema = require('openapi-schema-to-json-schema');
// OR: toJsonSchema = require('openapi-schema-to-json-schema').fromSchema;

var schema = {
  type: 'string',
  format: 'date-time',
  nullable: true
};

var convertedSchema = toJsonSchema(schema);

console.log(convertedSchema);
```

The example prints out

```js
{
  type: ['string', 'null'],
  format: 'date-time',
  '$schema': 'http://json-schema.org/draft-04/schema#'
}
```

Provide the function the schema object with possible options.

### Options

The function accepts `options` object as the second argument.

#### `cloneSchema` (boolean)

If set to `false`, converts the provided schema in place. If `true`, clones the schema by converting it to JSON and back. The overhead of the cloning is usually negligible. Defaults to `true`.

#### `dateToDateTime` (boolean)

This is `false` by default and leaves `date` format as is. If set to `true`, sets `format: 'date'` to `format: 'date-time'`.

For example

```js
var schema = {
  type: 'string',
  format: 'date'
};

var convertedSchema = toJsonSchema(schema, {dateToDateTime: true});

console.log(convertedSchema);
```

prints

```js
{
  type: 'string',
  format: 'date-time',
  '$schema': 'http://json-schema.org/draft-04/schema#'
}
```

#### `keepNotSupported` (array)

By default, the following fields are removed from the result schema: `nullable`, `discriminator`, `readOnly`, `writeOnly`, `xml`, `externalDocs`, `example` and `deprecated` as they are not supported by JSON Schema Draft 4. Provide an array of the ones you want to keep (as strings) and they won't be removed.

#### `removeReadOnly` (boolean)

If set to `true`, will remove properties set as `readOnly`. If the property is set as `required`, it will be removed from the `required` array as well. The property will be removed even if `readOnly` is set to be kept with `keepNotSupported`.

#### `removeWriteOnly` (boolean)

Similar to `removeReadOnly`, but for `writeOnly` properties.

#### `supportPatternProperties` (boolean)

If set to `true` and `x-patternProperties` property is present, change `x-patternProperties` to `patternProperties` and call `patternPropertiesHandler`. If `patternPropertiesHandler` is not defined, call the default handler. See `patternPropertiesHandler` for more information.

#### `patternPropertiesHandler` (function)

Provide a function to handle pattern properties and set `supportPatternProperties` to take effect. The function takes the schema where `x-patternProperties` is defined on the root level. At this point `x-patternProperties` is changed to `patternProperties`. It must return the modified schema.

If the handler is not provided, the default handler is used. If `additionalProperties` is set and is an object, the default handler sets it to false if the `additionalProperties` object has deep equality with a pattern object inside `patternProperties`. This is because we might want to define `additionalProperties` in OpenAPI spec file, but want to validate against a pattern. The pattern would turn out to be useless if `additionalProperties` of the same structure were allowed. Create you own handler to override this functionality.

See `test/pattern_properties.test.js` for examples how this works.

## Converting OpenAPI parameters

OpenAPI parameters can be converted:

```js
var toJsonSchema = require('openapi-schema-to-json-schema').fromParameter;

var param = {
  name: 'parameter name',
  in: 'query',
  schema: {
    type: 'string',
    format: 'date'
  }
}

var convertedSchema = toJsonSchema(param);

console.log(convertedSchema);
```

The result is as follows:

```js
{
  type: 'string',
  format: 'date',
  '$schema': 'http://json-schema.org/draft-04/schema#'
}
```

When a parameter has several schemas (one per MIME type) a map is returned instead.

```js
{
  name: 'parameter name',
  in: 'query',
  content: {
    'application/javascript': {
      schema: {
        type: 'string'
      }
    },
    'text/css': {
      schema: {
        type: 'string'
      }
    }
  }
}
```

would be converted to:

```js
{
  'application/javascript': {
    type: 'string',
    '$schema': 'http://json-schema.org/draft-04/schema#'
  },
  'text/css': {
    type: 'string',
    '$schema': 'http://json-schema.org/draft-04/schema#'
  }
}
```
