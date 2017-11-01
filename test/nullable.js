var test = require('tape')
	, convert = require('../')
;

test('handles nullable', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		type: 'string',
		nullable: true
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	assert.deepEqual(result, expected, 'nullable converted');

	schema = {
		type: 'string',
		nullable: false,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string'
	};

	assert.deepEqual(result, expected, 'nullable removed, type untouched');
});
