var test = require('tape');
var convert = require('../');

test('cloning schema by default', function (assert) {
  var schema;
  var result;
  var expected;

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

  assert.deepEqual(result, expected, 'converted')
  assert.notEqual(result, schema, 'schema cloned')
})

test('cloning schema with cloneSchema option', function (assert) {
  assert.plan(2);

  var schema = {
    type: 'string',
    nullable: true
  }

  var result = convert(schema, { cloneSchema: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null']
  }

  assert.deepEqual(result, expected, 'converted')
  assert.notEqual(result, schema, 'schema cloned')
})

test('handles circular references', function (assert) {
  assert.plan(1);

  var a = {}; a.a = a;

  var schema = {
    type: 'string',
    nullable: true,
    a
  }

  var result = convert(schema, { cloneSchema: true })

  assert.notEqual(result, schema, 'schema cloned')
})


test('direct schema modification', function (assert) {
  assert.plan(2)

  var schema = {
    type: 'string',
    nullable: true,
  }

  var result = convert(schema, { cloneSchema: false })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null']
  }

  assert.deepEqual(result, expected, 'converted')
  assert.equal(result, schema, 'schema not cloned')
})
