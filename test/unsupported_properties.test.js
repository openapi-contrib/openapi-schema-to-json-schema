var test = require('tape')
	, convert = require('../')
;

test('remove discriminator by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		oneOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'string'
					}
				}
			},
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'string'
					}
				}
			}
		],
		discriminator: {
			propertyName: 'foo'
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		oneOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'string'
					}
				}
			},
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'string'
					}
				}
			}
		],
	};

	assert.deepEqual(result, expected, 'discriminator removed');
});

test('remove readOnly by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			readOnly: {
				type: 'string',
				readOnly: true
			}
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			readOnly: {
				type: 'string'
			}
		}
	};
	assert.deepEqual(result, expected, 'readOnly removed');
});

test('remove writeOnly by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			test: {
				type: 'string',
				writeOnly: true
			}
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			test: {
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'writeOnly removed');
});

test('remove xml by default', function(assert) {
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
				xml: {
					attribute: true
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
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'xml removed');
});

test('remove externalDocs by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			foo: {
				type: 'string'
			}
		},
		externalDocs: {
			url: 'http://foo.bar'
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string'
			}
		}
	};

	assert.deepEqual(result, expected, 'externalDocs removed');
});

test('remove example by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		example: 'foo'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string'
	};

	assert.deepEqual(result, expected, 'example removed');
});

test('remove deprecated by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		deprecated: true
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string'
	};

	assert.deepEqual(result, expected, 'deprecated removed');
});

test('retaining fields', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			readOnly: {
				type: 'string',
				readOnly: true,
				example: 'foo'
			},
			anotherProp: {
				type: 'object',
				properties: {
					writeOnly: {
						type: 'string',
						writeOnly: true
					}
				}
			}
		},
		discriminator: 'bar'
	};

	result = convert(schema, { keepNotSupported: ['readOnly', 'discriminator'] });

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			readOnly: {
				type: 'string',
				readOnly: true,
			},
			anotherProp: {
				type: 'object',
				properties: {
					writeOnly: {
						type: 'string',
					}
				}
			}
		},
		discriminator: 'bar'
	};

	assert.deepEqual(result, expected, 'example and writeOnly removed');
});
