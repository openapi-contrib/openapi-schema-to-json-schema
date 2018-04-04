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
		additionalProperties: false,
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties set to false');
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
		additionalProperties: false,
		patternProperties: {
			'^[a-z]*$': {
				type: 'number'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties set to false');
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
		additionalProperties: false,
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'number'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties set to false');
});

test('handling additionalProperties with matching objects', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'object',
			properties: {
				test: {
					type: 'string'
				}
			}
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'object',
				properties: {
					test: {
						type: 'string'
					}
				}
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: false,
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'object',
				properties: {
					test: {
						type: 'string'
					}
				}
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties set to false');
});

test('handling additionalProperties with non-matching objects', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'object',
			properties: {
				test: {
					type: 'string'
				}
			}
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'object',
				properties: {
					test: {
						type: 'integer'
					}
				}
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: {
			type: 'object',
			properties: {
				test: {
					type: 'string'
				}
			}
		},
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'object',
				properties: {
					test: {
						type: 'integer'
					}
				}
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties not changed');
});

test('handling additionalProperties with matching array', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			type: 'array',
			items: {
				type: 'string'
			}
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'array',
				items: {
					type: 'string'
				}
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: false,
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			},
			'^[A-Z]*$': {
				type: 'array',
				items: {
					type: 'string'
				}
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties set to false');
});

test('handling additionalProperties with composition types', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: {
			oneOf: [
				{
					type: 'string'
				},
				{
					type: 'integer'
				}
			]
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				oneOf: [
					{
						type: 'string'
					},
					{
						type: 'integer'
					}
				]
			}
		}
	};

	result = convert(schema, {supportPatternProperties: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: false,
		patternProperties: {
			'^[a-z]*$': {
				oneOf: [
					{
						type: 'string'
					},
					{
						type: 'integer'
					}
				]
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties set to false');
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

test('additionalProperties not modified if set to true', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		additionalProperties: true,
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
		additionalProperties: true,
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'additionalProperties not removed');
});

