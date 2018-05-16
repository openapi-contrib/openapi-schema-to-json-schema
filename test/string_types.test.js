var test = require('tape')
	, convert = require('../')
;

test('plain string is untouched', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string'
	};

	assert.deepEqual(result, expected, 'string untouched');
});

test('handling date', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		type: 'string',
		format: 'date'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'date'
	};

	assert.deepEqual(result, expected, 'date retained');

	schema = {
		type: 'string',
		format: 'date'
	};

	result = convert(schema, {'dateToDateTime': true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'date-time'
	};

	assert.deepEqual(result, expected, 'date converted to date-time');
});

test('handles byte format', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		format: 'byte'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'byte',
		pattern: '^[\\w\\d+\\/=]*$'
	};

	assert.deepEqual(result, expected, 'byte converted to pattern');
});

test('retaining custom formats', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		format: 'custom_email'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'custom_email'
	};

	assert.deepEqual(result, expected, 'custom format retained');
});

test('retain password format', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		format: 'password'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'password'
	};

	assert.deepEqual(result, expected, 'password format retained');
});

test('retain binary format', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		format: 'binary'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'binary'
	};

	assert.deepEqual(result, expected, 'binary format retained');
});
