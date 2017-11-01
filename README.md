# OpenAPI Schema to JSON Schema

A little NodeJS package to convert OpenAPI Schema Object to JSON Schema. Currently converts from [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) to [JSON Schema Draft 4](http://json-schema.org/specification-links.html#draft-4).

## Why?

OpenAPI is a specification for describing RESTful APIs. OpenAPI 3.0 allows us to describe the structures of request and response payloads in a detailed manner. This would, theoretically, mean that we should be able to automatically validate request and response payloads. However, as of writing there aren't many validators around.

The good news is that there are many validators for JSON Schema for different languages. The bad news is that OpenAPI 3.0 is not entirely compatible with JSON Schema. The Schema Object of OpenAPI 3.0 is an extended subset of JSON Schema Specification Wright Draft 00 with some differences.

The purpose of this project is to fill the grap by doing the conversion between these two formats.

## Features

* converts OpenAPI 3.0 Schema Object to JSON Schema Draft 4
* converts [common named data types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#data-types) to `type` and `format`
  * for example `type: "dateTime"` becomes `type: "string"` with `format: "date-time"`
* deletes `nullable` and adds `"null"` to `type` array if `nullable` is `true`
* supports deep structures with nested `allOf`s etc.
* removes [OpenAPI specific properties](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#fixed-fields-20) such as `discriminator`, `deprecated` etc.

**NOTE**: `$ref`s are not dereferenced. Use a dereferences such as [json-schema-ref-parser](https://www.npmjs.com/package/json-schema-ref-parser) prior to using this package.

## Installation

```
npm install --save openapi-schema-to-json-schema
```

## Usage

Here's a small example to get the idea:

```js

var toJsonSchema = require('openapi-schema-to-json-schema');

var schema = {
  type: 'dateTime',
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

The function accepts `options` object as the second argument. Currently, the following options are supported:
* `cloneSchema` (boolean)
  * If set to `false`, converts the provided schema in place. If `true`, clones the schema by converting it to JSON and back. The overhead of the cloning is usually negligible. Defaults to `true`.
* `dateToDateTime` (boolean)
  * This is `false` by default and leaves `date` type/format as is. If set to `true`, sets `type: "string"` and `format: "date-time"` if
    * `type: "string"` AND `format: "date"` OR
	* `type: "date"`
  * For example

	```js
	var schema = {
	  type: 'date',
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
