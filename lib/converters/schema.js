var InvalidTypeError = require('../errors/invalid-type-error');

module.exports = convertFromSchema;

// Convert from OpenAPI 3.0 `SchemaObject` to JSON schema v4
function convertFromSchema(schema, options) {
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

function validateType(type) {
	var validTypes = ['integer', 'number', 'string', 'boolean', 'object', 'array'];

	if (validTypes.indexOf(type) < 0 && type !== undefined) {
		throw new InvalidTypeError('Type ' + JSON.stringify(type) + ' is not a valid type');
	}
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

function convertTypes(schema) {
	if (schema.type !== undefined && schema.nullable === true) {
		schema.type = [schema.type, 'null'];

		if (Array.isArray(schema.enum)) {
			schema.enum = schema.enum.concat([null]);
		}
	}

	return schema;
}

function convertFormat(schema, options) {
	var format = schema.format;
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
	};

	// Valid JSON schema v4 formats
	var FORMATS = ['date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'uri-reference'];

	if (format === undefined || FORMATS.indexOf(format) !== -1) {
		return schema;
	}

	if (format === 'date' && options.dateToDateTime === true) {
		return convertFormatDate(schema);
	}

	var formatConverters = {
		int32: convertFormatInt32,
		int64: convertFormatInt64,
		float: convertFormatFloat,
		double: convertFormatDouble,
		byte: convertFormatByte
	};

	var converter = formatConverters[format];

	if (converter === undefined) { return schema; }

	return converter(schema, settings);
}

function convertFormatInt32(schema, settings) {
	schema.minimum = settings.MIN_INT_32;
	schema.maximum = settings.MAX_INT_32;
	return schema;
}

function convertFormatInt64(schema, settings) {
	schema.minimum = settings.MIN_INT_64;
	schema.maximum = settings.MAX_INT_64;
	return schema;
}

function convertFormatFloat(schema, settings) {
	schema.minimum = settings.MIN_FLOAT;
	schema.maximum = settings.MAX_FLOAT;
	return schema;
}

function convertFormatDouble(schema, settings) {
	schema.minimum = settings.MIN_DOUBLE;
	schema.maximum = settings.MAX_DOUBLE;
	return schema;
}

function convertFormatDate(schema) {
	schema.format = 'date-time';
	return schema;
}

function convertFormatByte (schema, settings) {
	schema.pattern = settings.BYTE_PATTERN;
	return schema;
}

function convertPatternProperties(schema, handler) {
	schema.patternProperties = schema['x-patternProperties'];
	delete schema['x-patternProperties'];

	return handler(schema);
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
