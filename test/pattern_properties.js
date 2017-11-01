var test = require('tape')
	, convert = require('../')
;

test('handling additional properties of the same type: string', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties deleted');
});

test('handling additional properties of the same type: number', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'number'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'number'
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		patternProperties: {
			'^[a-z]*$': {
				type: 'number'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties deleted');
});

test('handling additional properties with one of patternProperty types', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'number'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'number'
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'number'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties deleted');
});

test('keeping additionalProperties with object type', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'object'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'object'
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: {
			type: 'object'
		},
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'object'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties kept');
});

test('not supporting patternProperties', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	result = convert(schema, {supportPatternProperties: false});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'nothing done');
});

test('not supporting patternProperties by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'nothing done');
});

test('setting custom patternProperties handler', function(assert) {
	var schema
		, result
		, expected
		, options
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	options = {
		supportPatternProperties: true,
		patternPropertiesHandler: function(schema) {
			schema.patternProperties = false;
			return schema;
		}
	};
	
	result = convert(schema, options);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		patternProperties: false
	};

	assert.deepEqual(result, expected, 'handler with custom handler');
});
