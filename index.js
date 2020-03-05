const deepEqual = require('fast-deep-equal');
const convert = require('./lib/convert');

module.exports = openapiSchemaToJsonSchema;
module.exports.fromSchema = openapiSchemaToJsonSchema;
module.exports.fromParameter = openapiParameterToJsonSchema;

function openapiSchemaToJsonSchema(schema, options) {
	options = resolveOptions(options);

	if (options.cloneSchema) {
		schema = JSON.parse(JSON.stringify(schema));
	}

  return convert.fromSchema(schema, options);
}

function openapiParameterToJsonSchema(parameter, options) {
	options = resolveOptions(options);

	if (options.cloneSchema) {
		parameter = JSON.parse(JSON.stringify(parameter));
	}

  return convert.fromParameter(parameter, options);
}

function resolveOptions(options) {
  const notSupported = ['nullable', 'discriminator', 'readOnly', 'writeOnly', 'xml', 'externalDocs', 'example', 'deprecated'];

  options = options || {};
	options.dateToDateTime = options.dateToDateTime || false;
	options.cloneSchema = options.cloneSchema != false;
	options.supportPatternProperties = options.supportPatternProperties || false;
	options.keepNotSupported = options.keepNotSupported || [];
	options.strictMode = options.strictMode != false;

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

	return options;
}

function patternPropertiesHandler(schema) {
  let pattern;
  const patternsObj = schema.patternProperties;
  const additProps = schema.additionalProperties;

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
  let index;

  for (let i = 0; i < toRetain.length; i++) {
		index = notSupported.indexOf(toRetain[i]);

		if (index >= 0) {
			notSupported.splice(index, 1);
		}
	}

	return notSupported;
}
