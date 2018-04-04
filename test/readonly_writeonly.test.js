var test = require('tape')
	, convert = require('../')
;

test('removing readOnly prop', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
			}
		}
	};

	result = convert(schema, { removeReadOnly: true });

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			prop2: {
				type: 'string',
			}
		}
	};

	assert.deepEqual(result, expected, 'readOnly prop removed');
});

test('removing readOnly prop even if keeping', function(assert) {
	var schema
		, result
		, expected
		, options
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
			}
		}
	};

	options = {
		removeReadOnly: true,
		keepNotSupported: ['readOnly']
	};

	result = convert(schema, options);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			prop2: {
				type: 'string',
			}
		}
	};

	assert.deepEqual(result, expected, 'readOnly prop removed');
});

test('removing writeOnly prop', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				writeOnly: true
			},
			prop2: {
				type: 'string',
			}
		}
	};

	result = convert(schema, { removeWriteOnly: true });

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			prop2: {
				type: 'string',
			}
		}
	};

	assert.deepEqual(result, expected, 'writeOnly prop removed');
});

test('removing readOnly from required', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
			}
		}
	};

	result = convert(schema, { removeReadOnly: true });

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		required: ['prop2'],
		properties: {
			prop2: {
				type: 'string',
			}
		}
	};

	assert.deepEqual(result, expected, 'readOnly prop removed from required');
});

test('deleting required if empty', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['prop1'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
			}
		}
	};

	result = convert(schema, { removeReadOnly: true });

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			prop2: {
				type: 'string',
			}
		}
	};

	assert.deepEqual(result, expected, 'required removed');
});

test('deleting properties if empty', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['prop1'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			}
		}
	};

	result = convert(schema, { removeReadOnly: true });

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object'
	};

	assert.deepEqual(result, expected, 'properties removed');
});

test('not removing readOnly props by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
			}
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
			},
			prop2: {
				type: 'string',
			}
		}
	};

	assert.deepEqual(result, expected, 'readOnly props not removed');
});

test('not removing writeOnly props by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				writeOnly: true
			},
			prop2: {
				type: 'string',
			}
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
			},
			prop2: {
				type: 'string',
			}
		}
	};

	assert.deepEqual(result, expected, 'writeOnly props not removed');
});

test('deep schema', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				allOf: [
					{
						type: 'object',
						required: ['prop3'],
						properties: {
							prop3: {
								type: 'object',
								readOnly: true
							}
						}
					},
					{
						type: 'object',
						properties: {
							prop4: {
								type: 'object',
								readOnly: true
							}
						}
					},
				]
			}
		}
	};

	result = convert(schema, { removeReadOnly: true });

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		required: ['prop2'],
		properties: {
			prop2: {
				allOf: [
					{
						type: 'object'
					},
					{
						type: 'object'
					},
				]
			}
		}
	};

	assert.deepEqual(result, expected, 'writeOnly props not removed');
});

