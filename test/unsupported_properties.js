var test = require('tape')
	, convert = require('../')
;

test('remove discriminator', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		oneOf: [
			{
				type: 'object',
				required: 'foo',
				properties: {
					foo: {
						type: 'string'
					}
				}
			},
			{
				type: 'object',
				required: 'foo',
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
				required: 'foo',
				properties: {
					foo: {
						type: 'string'
					}
				}
			},
			{
				type: 'object',
				required: 'foo',
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

test('remove readOnly', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		readOnly: true
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string'
	};

	assert.deepEqual(result, expected, 'readOnly removed');
});

test('remove writeOnly', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		format: 'password',
		writeOnly: true
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'password'
	};

	assert.deepEqual(result, expected, 'writeOnly removed');
});

test('remove xml', function(assert) {
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

test('remove externalDocs', function(assert) {
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

test('remove example', function(assert) {
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

test('remove deprecated', function(assert) {
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
