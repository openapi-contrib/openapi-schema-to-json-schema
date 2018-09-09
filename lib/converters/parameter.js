var convertFromSchema = require('./schema');
var InvalidInputError = require('../errors/invalid-input-error');

module.exports = convertFromParameter;

// Convert from OpenAPI 3.0 `ParameterObject` to JSON schema v4
function convertFromParameter(parameter, options) {
	if (parameter.schema !== undefined) {
		return convertParameterSchema(parameter, parameter.schema, options);
	} else if (parameter.content !== undefined) {
		return convertFromContents(parameter, options);
	} else {
		throw new InvalidInputError('OpenAPI parameter must have either a \'schema\' or a \'content\' property');
	}
}

function convertFromContents(parameter, options) {
	var schemas = {};

	for (var mime in parameter.content) {
		schemas[mime] = convertParameterSchema(parameter, parameter.content[mime].schema, options);
	}

	return schemas;
}

function convertParameterSchema(parameter, schema, options) {
	var jsonSchema = convertFromSchema(schema || {}, options);

	if (parameter.description) {
		jsonSchema.description = parameter.description;
	}

	return jsonSchema;
}
