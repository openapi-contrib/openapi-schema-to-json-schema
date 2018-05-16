var test = require('tape')
	, convert = require('../')
;

test('properties', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['bar'],
		properties: {
			foo: {
				type: 'string',
				example: '2017-01-01T12:34:56Z'
			},
			bar: {
				type: 'string',
				nullable: true
			}
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		required: ['bar'],
		properties: {
			foo: {
				type: 'string',
			},
			bar: {
				type: ['string', 'null']
			}
		}
	};

	assert.deepEqual(result, expected, 'converted');
});

test('additionalProperties is false', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
				example: '2017-01-01T12:34:56Z'
			}
		},
		additionalProperties: false
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: false
	};

	assert.deepEqual(result, expected, 'properties converted');
});

test('additionalProperties is true', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
				example: '2017-01-01T12:34:56Z'
			}
		},
		additionalProperties: true
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: true
	};

	assert.deepEqual(result, expected, 'properties converted');
});

test('additionalProperties is an object', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
				example: '2017-01-01T12:34:56Z'
			}
		},
		additionalProperties: {
			type: 'object',
			properties: {
				foo: {
					type: 'string'
				}
			}
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: {
			type: 'object',
			properties: {
				foo: {
					type: 'string'
				}
			}
		}
	};

	assert.deepEqual(result, expected, 'properties and additionalProperties converted');
});
