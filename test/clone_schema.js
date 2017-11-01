var test = require('tape')
	, convert = require('../')
;

test('cloning schema by default', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		type: 'string',
		nullable: true,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	assert.deepEqual(result, expected, 'converted');
	assert.notEqual(result, schema, 'schema cloned');
});

test('cloning schema with cloneSchema option', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		type: 'string',
		nullable: true,
	};

	result = convert(schema, {cloneSchema: true});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	assert.deepEqual(result, expected, 'converted');
	assert.notEqual(result, schema, 'schema cloned');
});

test('direct schema modification', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		type: 'string',
		nullable: true,
	};

	result = convert(schema, {cloneSchema: false});

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	assert.deepEqual(result, expected, 'converted');
	assert.equal(result, schema, 'schema not cloned');
});
