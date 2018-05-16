var deepEqual = require('deep-equal');

module.exports = convert;

function InvalidTypeError(message) {
	this.name = 'InvalidTypeError';
	this.message = message;
}

InvalidTypeError.prototype = new Error();

function convert(schema, options) {
	var notSupported = [
		'nullable', 'discriminator', 'readOnly',
		'writeOnly', 'xml', 'externalDocs',
		'example', 'deprecated'
	];

	options = options || {};
	options.dateToDateTime = options.dateToDateTime || false;
	options.cloneSchema = options.cloneSchema == false ? false : true;
	options.supportPatternProperties = options.supportPatternProperties || false;
	options.keepNotSupported = options.keepNotSupported || [];

	if (typeof options.patternPropertiesHandler !== 'function') {
		options.patternPropertiesHandler = patternPropertiesHandler;
	}

	options._removeProps = [];

	if (options.removeReadOnly === true) {
		options._removeProps.push('readOnly');
	}

	if (options.removeWriteOnly === true) {
		options._removeProps.push('writeOnly');
	}

	options._structs = ['allOf', 'anyOf', 'oneOf', 'not', 'items', 'additionalProperties'];
	options._notSupported = resolveNotSupported(notSupported, options.keepNotSupported);

	if (options.cloneSchema) {
		schema = JSON.parse(JSON.stringify(schema));
	}

	schema = convertSchema(schema, options);
	schema['$schema'] = 'http://json-schema.org/draft-04/schema#';

	return schema;
}

function convertSchema(schema, options) {
	var structs = options._structs
		, notSupported = options._notSupported
		, i = 0
		, j = 0
		, struct = null
	;

	for (i; i < structs.length; i++) {
		struct = structs[i];

		if (Array.isArray(schema[struct])) {
			for (j; j < schema[struct].length; j++) {
				schema[struct][j] = convertSchema(schema[struct][j], options);
			}
		} else if (typeof schema[struct] === 'object') {
			schema[struct] = convertSchema(schema[struct], options);
		}
	}

	if (typeof schema.properties === 'object') {
		schema.properties = convertProperties(schema.properties, options);

		if (Array.isArray(schema.required)) {
			schema.required = cleanRequired(schema.required, schema.properties);

			if (schema.required.length === 0) {
				delete schema.required;
			}
		}
		if (Object.keys(schema.properties).length === 0) {
			delete schema.properties;
		}

	}

	validateType(schema.type);
	schema = convertTypes(schema);
	schema = convertFormat(schema, options);

	if (typeof schema['x-patternProperties'] === 'object'
			&& options.supportPatternProperties) {
		schema = convertPatternProperties(schema, options.patternPropertiesHandler);
	}

	for (i=0; i < notSupported.length; i++) {
		delete schema[notSupported[i]];
	}

	return schema;
}

function convertProperties(properties, options) {
	var key
		, property
		, props = {}
		, removeProp
	;

	for (key in properties) {
		removeProp = false;
		property = properties[key];

		options._removeProps.forEach(function(prop) {
			if (property[prop] === true) {
				removeProp = true;
			}
		});

		if (removeProp) {
			continue;
		}

		props[key] = convertSchema(property, options);
	}

	return props;
}

function validateType(type) {
	var validTypes = ['integer', 'number', 'string', 'boolean', 'object', 'array'];

	if (validTypes.indexOf(type) < 0 && type !== undefined) {
		throw new InvalidTypeError('Type "' + type + '" is not a valid type');
	}
}

function convertTypes(schema) {
	if (schema.type !== undefined && schema.nullable === true) {
		schema.type = [schema.type, 'null'];
	}

	return schema;
}

function convertFormat(schema, options) {
	var format = schema.format;

	if (format === undefined || FORMATS.indexOf(format) !== -1) {
		return schema;
	}

	var converter = formatConverters[format];

	if (converter === undefined) { return schema; }

	return converter(schema, options);
}

// Valid JSON schema v4 formats
var FORMATS = ['date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'uri-reference'];

function convertFormatInt32 (schema) {
	schema.minimum = MIN_INT_32;
	schema.maximum = MAX_INT_32;
	return schema;
}

var MIN_INT_32 = 0 - Math.pow(2, 31);
var MAX_INT_32 = Math.pow(2, 31) - 1;

function convertFormatInt64 (schema) {
	schema.minimum = MIN_INT_64;
	schema.maximum = MAX_INT_64;
	return schema;
}

var MIN_INT_64 = 0 - Math.pow(2, 63);
var MAX_INT_64 = Math.pow(2, 63) - 1;

function convertFormatFloat (schema) {
	schema.minimum = MIN_FLOAT;
	schema.maximum = MAX_FLOAT;
	return schema;
}

var MIN_FLOAT = 0 - Math.pow(2, 128);
var MAX_FLOAT = Math.pow(2, 128) - 1;

function convertFormatDouble (schema) {
	schema.minimum = MIN_DOUBLE;
	schema.maximum = MAX_DOUBLE;
	return schema;
}

var MIN_DOUBLE = 0 - Number.MAX_VALUE;
var MAX_DOUBLE = Number.MAX_VALUE;

function convertFormatDate (schema, options) {
	if (options.dateToDateTime === true) {
		schema.format = 'date-time';
	}

	return schema;
}

function convertFormatByte (schema) {
	schema.pattern = BYTE_PATTERN;
	return schema;
}

// Matches base64 (RFC 4648)
// Matches `standard` base64 not `base64url`. The specification does not
// exclude it but current ongoing OpenAPI plans will distinguish btoh.
var BYTE_PATTERN = '^[\\w\\d+\\/=]*$';

var formatConverters = {
	int32: convertFormatInt32,
	int64: convertFormatInt64,
	float: convertFormatFloat,
	double: convertFormatDouble,
	date: convertFormatDate,
	byte: convertFormatByte
};

function convertPatternProperties(schema, handler) {
	schema.patternProperties = schema['x-patternProperties'];
	delete schema['x-patternProperties'];

	return handler(schema);
}

function patternPropertiesHandler(schema) {
	var pattern
		, patternsObj = schema.patternProperties
		, additProps = schema.additionalProperties
	;

	if (typeof additProps !== 'object') {
		return schema;
	}

	for (pattern in patternsObj) {
		if (deepEqual(patternsObj[pattern], additProps)) {
			schema.additionalProperties = false;
			break;
		}
	}

	return schema;
}

function resolveNotSupported(notSupported, toRetain) {
	var i = 0
		, index
	;

	for (i; i < toRetain.length; i++) {
		index = notSupported.indexOf(toRetain[i]);

		if (index >= 0) {
			notSupported.splice(index, 1);
		}
	}

	return notSupported;
}

function cleanRequired(required, properties) {
	var i = 0;

	required = required || [];
	properties = properties || {};

	for (i; i < required.length; i++) {
		if (properties[required[i]] === undefined) {
			required.splice(i, 1);
		}
	}

	return required;
}
