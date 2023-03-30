# OpenAPI Schema to JSON Schema

A little NodeJS package to convert OpenAPI Schema Object or Parameter Object to JSON Schema.

Currently converts from [OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3.html) to [JSON Schema Draft 4](http://json-schema.org/specification-links.html#draft-4).

[![Treeware](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=Treeware&query=%24.total&url=https%3A%2F%2Fpublic.offset.earth%2Fusers%2Ftreeware%2Ftrees)](https://treeware.earth)

## Why?

OpenAPI is a specification for describing RESTful APIs. OpenAPI v3.0 allows us to describe the structures of request and response payloads in a detailed manner. This would, theoretically, mean that we should be able to automatically validate request and response payloads. However, as of writing there aren't many validators around.

The good news is that there are many validators for JSON Schema for different languages. The bad news is that OpenAPI v3.0 is [not entirely compatible with JSON Schema](https://stoplight.io/blog/openapi-json-schema/). The Schema Object of OpenAPI v3.0 is an extended subset of JSON Schema Specification Wright Draft 00 with some differences. This will be resolved in OpenAPI v3.1, but until then... this tool will fill that gap.

There is also a [CLI tool](https://github.com/mikunn/openapi2schema) for creating a JSON of schemas from the whole API specification.

If you need to do the conversion in reverse, checkout [json-schema-to-openapi-schema](https://github.com/openapi-contrib/json-schema-to-openapi-schema).

## Features

* converts OpenAPI v3.0 Schema Object to JSON Schema Draft 4
* converts OpenAPI v3.0 Parameter Object to JSON Schema Draft 4
* deletes `nullable` and adds `"null"` to `type` array if `nullable` is `true`
* supports deep structures with nested `allOf`s etc.
* removes [OpenAPI specific properties](https://spec.openapis.org/oas/v3.0.3.html#fixed-fields-20) such as `discriminator`, `deprecated` etc. unless specified otherwise
* optionally supports `patternProperties` with `x-patternProperties` in the Schema Object

**NOTE**: `$ref`s are not handled in any way, so please use a resolver such as [json-schema-ref-parser](https://github.com/APIDevTools/json-schema-ref-parser) or [swagger-cli bundle](https://www.npmjs.com/package/swagger-cli) prior to using this package.

## Installation

```
npm install --save @openapi-contrib/openapi-schema-to-json-schema
```

## Converting OpenAPI schema

Here's a small example to get the idea:

```js

var toJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema');

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

var convertedSchema = toJsonSchema(schema, { dateToDateTime: true });

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
var toJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema').fromParameter;

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

## Treeware

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/{venfor}/{package}) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

## Thanks

- [Stoplight][] for donating time and effort to this project, and many more.
- [mikunn][] for originally creating this package.
- [All Contributors][link-contributors]

[Stoplight]: https://stoplight.io/
[mikunn]: https://github.com/mikunn
[link-contributors]: https://github.com/openapi-contrib/openapi-schema-to-json-schema/graphs/contributors

## Copyright  

Copyright 2021 the [OpenAPI Contrib organization](https://github.com/openapi-contrib). Code released under the [MIT License](https://github.com/openapi-contrib/openapi-schema-to-json-schema/blob/main/LICENSE).
