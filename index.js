var deepEqual = require('deep-equal');

module.exports = convert;

function convert(schema, options) {
	options = options || {};
	options.dateToDateTime = options.dateToDateTime || false;
	options.cloneSchema = options.cloneSchema == false ? false : true;
	options.supportPatternProperties = options.supportPatternProperties || false;

	if (typeof options.patternPropertiesHandler !== 'function') {
		options.patternPropertiesHandler = patternPropertiesHandler;
	}

	options._structs = ['allOf', 'anyOf', 'oneOf', 'not', 'items', 'additionalProperties'];
	options._notSupported = [
		'nullable', 'discriminator', 'readOnly', 
		'writeOnly', 'xml', 'externalDocs',
		'example', 'deprecated'
	];

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
	}

	schema = convertTypes(schema, options);
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
	var key;

	for (key in properties) {
		properties[key] = convertSchema(properties[key], options);
	}

	return properties;
}

function convertTypes(schema, options) {
	var newType
		, newFormat
		, toDateTime = options.dateToDateTime
	;

	if (schema.type === undefined) {
		return schema;
	}

	if (schema.type == 'string' && schema.format == 'date' && toDateTime === true) {
		schema.format = 'date-time';
	}

	switch(schema.type) {
		case 'integer':
			newType = 'integer';
			break;
		case 'long':
			newType = 'integer';
			newFormat = 'int64';
			break;
		case 'float':
			newType = 'number';
			newFormat = 'float';
			break;
		case 'double':
			newType = 'number';
			newFormat = 'double';
			break;
		case 'byte':
			newType = 'string';
			newFormat = 'byte';
			break;
		case 'binary':
			newType = 'string';
			newFormat = 'binary';
			break;
		case 'date':
			newType = 'string';
			newFormat = 'date';
			if (toDateTime === true) {
				newFormat = 'date-time';
			}
			break;
		case 'dateTime':
			newType = 'string';
			newFormat = 'date-time';
			break;
		case 'password':
			newType = 'string';
			newFormat = 'password';
			break;
		default:
			newType = schema.type;
	}

	schema.type = newType;
	schema.format = typeof newFormat === 'string' ? newFormat : schema.format;

	if (! schema.format) {
		delete schema.format;
	}

	if (schema.nullable === true) {
		schema.type = [schema.type, 'null'];
	}
	
	return schema;
}

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
