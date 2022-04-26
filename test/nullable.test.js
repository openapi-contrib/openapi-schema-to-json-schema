var test = require('tape');
var convert = require('../');

test('handles nullable without enum', function (assert) {
  var schema, result, expected;

  assert.plan(2)

  schema = {
    type: 'string',
    nullable: true
  }

  result = convert(schema)

  expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null']
  }

  assert.deepEqual(result, expected, 'nullable converted')

  schema = {
    type: 'string',
    nullable: false
  }

  result = convert(schema)

  expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string'
  }

  assert.deepEqual(result, expected, 'nullable removed, type untouched')
})

test('handles nullable with enum', function (assert) {
  var schema, result, expected;

  assert.plan(3)

  schema = {
    type: 'string',
    enum: ['a', 'b'],
    nullable: true
  }

  result = convert(schema)

  expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null'],
    enum: ['a', 'b', null]
  }

  assert.deepEqual(result, expected, 'nullable converted')

  schema = {
    type: 'string',
    enum: ['a', 'b', null],
    nullable: true
  }

  result = convert(schema)

  expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null'],
    enum: ['a', 'b', null]
  }

  assert.deepEqual(result, expected, 'nullable converted, no duplicate')

  schema = {
    type: 'string',
    enum: ['a', 'b'],
    nullable: false
  }

  result = convert(schema)

  expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    enum: ['a', 'b']
  }

  assert.deepEqual(result, expected, 'nullable removed, type untouched')
})
