var isObject = require('../utils/isObject').isObject
var InvalidTypeError = require('../errors/invalid-type-error')

module.exports = convertFromSchema

// Convert from OpenAPI 3.0 `SchemaObject` to JSON schema v4
function convertFromSchema (schema, options) {
	schema = convertSchema(schema, options)

	schema.$schema = 'http://json-schema.org/draft-04/schema#'

	return schema
}

function convertSchema (schema, options) {
  if (options.cloneSchema) {
    schema = Object.assign({}, schema);
  }

  var structs = options._structs;
	var notSupported = options._notSupported;
	var strictMode = options.strictMode;
	var i = 0;
	var j = 0;
	var struct = null;

	for (i; i < structs.length; i++) {
		struct = structs[i]

		if (Array.isArray(schema[struct])) {
      var cloned = false;

      for (j; j < schema[struct].length; j++) {
				if (!isObject(schema[struct][j])) {
          if (options.cloneSchema && !cloned) {
            cloned = true;
            schema[struct] = schema[struct].slice();
          }

					schema[struct].splice(j, 1)
					j--
					continue
				}

				schema[struct][j] = convertSchema(schema[struct][j], options)
			}
		} else if (schema[struct] === null) {
			delete schema[struct]
		} else if (typeof schema[struct] === 'object') {
			schema[struct] = convertSchema(schema[struct], options)
		}
	}

	if ('properties' in schema) {
		schema.properties = convertProperties(schema.properties, options)

		if (Array.isArray(schema.required)) {
			schema.required = cleanRequired(schema.required, schema.properties)

			if (schema.required.length === 0) {
				delete schema.required
			}
		}
		if (Object.keys(schema.properties).length === 0) {
			delete schema.properties
		}
	}

	if (strictMode) {
		validateType(schema.type)
	}

	schema = convertTypes(schema)
	schema = convertFormat(schema, options)

	if ('x-patternProperties' in schema && options.supportPatternProperties) {
		schema = convertPatternProperties(schema, options.patternPropertiesHandler)
	}

	for (i = 0; i < notSupported.length; i++) {
		delete schema[notSupported[i]]
	}

	return schema
}

function validateType (type) {
	var validTypes = ['integer', 'number', 'string', 'boolean', 'object', 'array', 'null']

	if (validTypes.indexOf(type) < 0 && type !== undefined) {
		throw new InvalidTypeError('Type ' + JSON.stringify(type) + ' is not a valid type')
	}
}

function convertProperties (properties, options) {
	var key;
	var property;
	var props = {};
	var removeProp;

	if (!isObject(properties)) {
		return props
	}

	for (key in properties) {
		property = properties[key]

		if (!isObject(property)) {
			continue
		}

    removeProp = options._removeProps.some(function (prop) {
			return property[prop] === true
		})

		if (removeProp) {
			continue
		}

		props[key] = convertSchema(property, options)
	}

	return props
}

function convertTypes (schema) {
	if (schema.type !== undefined && schema.nullable === true) {
		schema.type = [schema.type, 'null']

		if (Array.isArray(schema.enum) && !schema.enum.includes(null)) {
			schema.enum = schema.enum.concat([null])
		}
	}

	return schema
}

function convertFormat (schema, options) {
	var format = schema.format
	var settings = {
		MIN_INT_32: 0 - Math.pow(2, 31),
		MAX_INT_32: Math.pow(2, 31) - 1,
		MIN_INT_64: 0 - Math.pow(2, 63),
		MAX_INT_64: Math.pow(2, 63) - 1,
		MIN_FLOAT: 0 - Math.pow(2, 128),
		MAX_FLOAT: Math.pow(2, 128) - 1,
		MIN_DOUBLE: 0 - Number.MAX_VALUE,
		MAX_DOUBLE: Number.MAX_VALUE,

		// Matches base64 (RFC 4648)
		// Matches `standard` base64 not `base64url`. The specification does not
		// exclude it but current ongoing OpenAPI plans will distinguish btoh.
		BYTE_PATTERN: '^[\\w\\d+\\/=]*$'
	}

	// Valid JSON schema v4 formats
	var FORMATS = ['date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'uri-reference']

	if (format === undefined || FORMATS.indexOf(format) !== -1) {
		return schema
	}

	if (format === 'date' && options.dateToDateTime === true) {
		return convertFormatDate(schema)
	}

	var formatConverters = {
		int32: convertFormatInt32,
		int64: convertFormatInt64,
		float: convertFormatFloat,
		double: convertFormatDouble,
		byte: convertFormatByte
	}

	var converter = formatConverters[format]

	if (converter === undefined) { return schema }

	return converter(schema, settings)
}

function convertFormatInt32 (schema, settings) {
  if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < settings.MIN_INT_32) {
		schema.minimum = settings.MIN_INT_32;
	}
	if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > settings.MAX_INT_32) {
		schema.maximum = settings.MAX_INT_32;
	}
	return schema
}

function convertFormatInt64 (schema, settings) {
	if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < settings.MIN_INT_64) {
		schema.minimum = settings.MIN_INT_64;
	}
	if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > settings.MAX_INT_64) {
		schema.maximum = settings.MAX_INT_64;
	}
	return schema
}

function convertFormatFloat (schema, settings) {
	if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < settings.MIN_FLOAT) {
		schema.minimum = settings.MIN_FLOAT;
	}
	if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > settings.MAX_FLOAT) {
		schema.maximum = settings.MAX_FLOAT;
	}
	return schema
}

function convertFormatDouble (schema, settings) {
	if ((!schema.minimum && schema.minimum !== 0) || schema.minimum < settings.MIN_DOUBLE) {
		schema.minimum = settings.MIN_DOUBLE;
	}
	if ((!schema.maximum && schema.maximum !== 0) || schema.maximum > settings.MAX_DOUBLE) {
		schema.maximum = settings.MAX_DOUBLE;
	}
	return schema
}

function convertFormatDate (schema) {
	schema.format = 'date-time'
	return schema
}

function convertFormatByte (schema, settings) {
	schema.pattern = settings.BYTE_PATTERN
	return schema
}

function convertPatternProperties (schema, handler) {
	if (isObject(schema['x-patternProperties'])) {
		schema.patternProperties = schema['x-patternProperties']
	}

	delete schema['x-patternProperties']

	return handler(schema)
}

function cleanRequired (required, properties) {
	required = required || []
	properties = properties || {}
	let remainedRequired = []

	for (let i = 0; i < required.length; i++) {
    if (properties[required[i]]) {
      remainedRequired.push(required[i])
    }
	}

	return remainedRequired
}
