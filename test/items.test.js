var test = require('tape')
	, convert = require('../')
;

test('items', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'array',
		items: {
			type: 'string',
			example: '2017-01-01T12:34:56Z'
		}
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'array',
		items: {
			type: 'string'
		}
	};

	assert.deepEqual(result, expected, 'converted');
});
