var test = require('tape');
var getSchema = require('./helpers').getSchema;
var convert = require('../');

test('complex schema', function (assert) {
  assert.plan(1)

  var schema = getSchema('schema-1.json')
  var result = convert(schema)
  var expected = getSchema('schema-1-expected.json')

  assert.deepEqual(result, expected, 'converted')
})

test('converting complex schema in place', function (assert) {
  assert.plan(2)

  var schema = getSchema('schema-1.json')
  var result = convert(schema, { cloneSchema: false })
  var expected = getSchema('schema-1-expected.json')

  assert.equal(schema, result, 'changed schema in place')
  assert.deepEqual(result, expected, 'converted')
})
