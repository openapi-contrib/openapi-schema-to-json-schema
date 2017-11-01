var test = require('tape')
	, convert = require('../')
;

test('converts integer types', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(3);

	schema = {
		type: 'integer',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
	};

	assert.deepEqual(result, expected, 'plain integer not changed');

	schema = {
		type: 'integer',
		format: 'int64'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int64'
	};

	assert.deepEqual(result, expected, 'respects integer format');

	schema = {
		type: 'long',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int64'
	};

	assert.deepEqual(result, expected, 'long converted');
});

test('converts number types', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(4);

	schema = {
		type: 'float',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'float'
	};

	assert.deepEqual(result, expected, 'float converted');

	schema = {
		type: 'double',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'double'
	};

	assert.deepEqual(result, expected, 'double converted');

	schema = {
		type: 'number',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
	};

	assert.deepEqual(result, expected, 'number untouched');

	schema = {
		type: 'number',
		format: 'float'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'float'
	};

	assert.deepEqual(result, expected, 'number and format untouched');
});
