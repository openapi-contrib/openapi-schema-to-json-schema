var test = require('tape');
var convert = require('../');

test('using examples array', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    examples: ['foo', 'bar']
  }

  var result = convert.fromSchema(schema, { convertExamples: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    examples: ['foo', 'bar']
  }

  assert.deepEqual(result, expected, 'examples converted')
})

test('using examples object', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    examples: {
      foo: {value: 'bar'},
      fizz: {value: 'buzz'},
      invalid: [],
    }
  }

  var result = convert.fromSchema(schema, { convertExamples: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    examples: ['bar', 'buzz']
  }

  assert.deepEqual(result, expected, 'examples converted')
})

test('using example field', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    example: 'foo'
  }

  var result = convert.fromSchema(schema, { convertExamples: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    examples: ['foo']
  }

  assert.deepEqual(result, expected, 'example converted')
})
