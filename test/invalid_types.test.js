var test = require('tape')
	, getSchema = require('./helpers').getSchema
	, convert = require('../')
;

test('invalid types', function(assert) {
	var schema, msg;

	assert.plan(3);

	schema = {
		type: 'dateTime'
	};

	msg = 'dateTime is invalid type';
	assert.throws(function() { convert(schema); }, /InvalidTypeError/, msg);

	schema = {
		type: 'foo'
	};

	msg = 'foo is invalid type';
	assert.throws(function() { convert(schema); }, /InvalidTypeError/, msg);

	schema = getSchema('schema-2-invalid-type.json');

	msg = 'invalid type inside complex schema';
	assert.throws(function() { convert(schema); }, /InvalidTypeError.*invalidtype/, msg);
});
