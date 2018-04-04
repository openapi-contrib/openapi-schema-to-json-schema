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
