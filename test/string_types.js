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

test('converting byte', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'byte'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'byte'
	};

	assert.deepEqual(result, expected, 'byte converted');
});

test('converting binary', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'binary'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'binary'
	};

	assert.deepEqual(result, expected, 'binary converted');
});

test('converting dateTime', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'dateTime'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'date-time'
	};

	assert.deepEqual(result, expected, 'dateTime converted');
});

test('converting date', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(3);

	schema = {
		type: 'date'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'date'
	};

	assert.deepEqual(result, expected, 'date converted');

	schema = {
		type: 'date'
	};

	result = convert(schema, {'dateToDateTime': true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'date-time'
	};

	assert.deepEqual(result, expected, 'date converted to date-time');

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

	assert.deepEqual(result, expected, 'changes only format');
});

test('converting password', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'password'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'password'
	};

	assert.deepEqual(result, expected, 'password converted');
});

test('retaining custom formats', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		format: 'email'
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		format: 'email'
	};

	assert.deepEqual(result, expected, 'email retained');
});
