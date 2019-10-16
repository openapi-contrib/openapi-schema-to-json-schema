var test = require('tape')
	, convert = require('../')
;

test('allOf is null', function(assert) {
	var schema
		, result
		, expected
  ;

	assert.plan(1);

	schema = {
		allOf: null,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
	};

	assert.deepEqual(result, expected, 'allOf is removed');
});

test('anyOf is null', function(assert) {
	var schema
		, result
		, expected
  ;

	assert.plan(1);

	schema = {
		anyOf: null,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
	};

	assert.deepEqual(result, expected, 'anyOf is removed');
});


test('oneOf is null', function(assert) {
	var schema
		, result
		, expected
  ;

	assert.plan(1);

	schema = {
		oneOf: null,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
	};

	assert.deepEqual(result, expected, 'oneOf is removed');
});
