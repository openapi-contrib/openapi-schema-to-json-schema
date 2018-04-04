var test = require('tape')
	, convert = require('../')
;

test('handles integer types', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		type: 'integer',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
	};

	assert.deepEqual(result, expected, 'integer type untouched');

	schema = {
		type: 'integer',
		format: 'int32',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int32'
	};

	assert.deepEqual(result, expected, 'integer type and format untouched');
});

test('handles number types', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		type: 'number',
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
	};

	assert.deepEqual(result, expected, 'number type untouched');

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

	assert.deepEqual(result, expected, 'number type and format untouched');
});
