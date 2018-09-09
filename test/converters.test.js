var test = require('tape')
	, convert = require('../')
;

test('using exports.fromSchema', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'string',
		nullable: true,
	};

	result = convert.fromSchema(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	assert.deepEqual(result, expected, 'converted');
});
