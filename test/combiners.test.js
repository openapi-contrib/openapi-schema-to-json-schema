var test = require('tape');
var convert = require('../');

test('allOf is null', function (assert) {
  assert.plan(1)

  var schema = {
    allOf: null
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#'
  }

  assert.deepEqual(result, expected, 'allOf is removed')
})

test('anyOf is null', function (assert) {
  assert.plan(1)

  var schema = {
    anyOf: null
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#'
  }

  assert.deepEqual(result, expected, 'anyOf is removed')
})

test('oneOf is null', function (assert) {
  assert.plan(1)

  var schema = {
    oneOf: null
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#'
  }

  assert.deepEqual(result, expected, 'oneOf is removed')
})
