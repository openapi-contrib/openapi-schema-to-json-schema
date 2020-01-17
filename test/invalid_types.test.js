var test = require('tape');
var getSchema = require('./helpers').getSchema;
var convert = require('../');

test('invalid types', function (assert) {
  var schema, msg;

  assert.plan(4)

  schema = {
    type: 'dateTime'
  }

  msg = 'dateTime is invalid type'
  assert.throws(function () { convert(schema) }, /InvalidTypeError/, msg)

  schema = {
    type: 'foo'
  }

  msg = 'foo is invalid type'
  assert.throws(function () { convert(schema) }, /InvalidTypeError/, msg)

  schema = {
    type: ['string', null]
  }

  assert.throws(function () { convert(schema) }, /InvalidTypeError.*["string",null]/, msg)

  schema = getSchema('schema-2-invalid-type.json')

  msg = 'invalid type inside complex schema'
  assert.throws(function () { convert(schema) }, /InvalidTypeError.*invalidtype/, msg)
})

test('valid types', function (assert) {
  var types = ['integer', 'number', 'string', 'boolean', 'object', 'array', 'null']

  assert.plan(types.length)

  types.forEach(function (type) {
    var schema, result, expected

    schema = {
      type: type
    }

    result = convert(schema)

    expected = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: type
    }

    assert.deepEqual(result, expected, type + ' ok')
  })

  test('invalid type allowed when strictMode = false', function (assert) {
    assert.plan(1)

    var schema = {
      type: 'nonsense'
    }

    var result = convert(schema, { strictMode: false })

    var expected = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'nonsense'
    }

    assert.deepEqual(result, expected, ' ok')
  })
})
