var test = require('tape');
var convert = require('../');

test('items', function (assert) {
	assert.plan(1)

	var schema = {
		type: 'array',
		items: {
			type: 'string',
			example: '2017-01-01T12:34:56Z'
		}
	}

	var result = convert(schema)

	var expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'array',
		items: {
			type: 'string'
		}
	}

	assert.deepEqual(result, expected, 'converted')
})

test('handles items with invalid values', function (assert) {
	assert.plan(1)

	var schema = {
		type: 'array',
		items: [
			{
				type: 'string'
			},
			2,
			null,
			{
				type: 'number'
			},
			'foo',
			{
				type: 'array'
			}
		]
	}

	var result = convert(schema)

	var expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'array',
		items: [
			{
				type: 'string'
			},
			{
				type: 'number'
			},
			{
				type: 'array'
			}
		]
	}

	assert.deepEqual(result, expected, 'converted')
})
