var test = require('tape');
var convert = require('../');

test('plain string is untouched', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string'
  }

  assert.deepEqual(result, expected, 'string untouched')
})

test('handles date', function (assert) {
  assert.plan(2)

  var schema = {
    type: 'string',
    format: 'date'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    format: 'date'
  }

  assert.deepEqual(result, expected, 'date retained')

  schema = {
    type: 'string',
    format: 'date'
  }

  result = convert(schema, { dateToDateTime: true })

  expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    format: 'date-time'
  }

  assert.deepEqual(result, expected, 'date converted to date-time')
})

test('handles byte format', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    format: 'byte'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    format: 'byte',
    pattern: '^[\\w\\d+\\/=]*$'
  }

  assert.deepEqual(result, expected, 'byte converted to pattern')
})

test('retaining custom formats', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    format: 'custom_email'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    format: 'custom_email'
  }

  assert.deepEqual(result, expected, 'custom format retained')
})

test('retain password format', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    format: 'password'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    format: 'password'
  }

  assert.deepEqual(result, expected, 'password format retained')
})

test('retain binary format', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    format: 'binary'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    format: 'binary'
  }

  assert.deepEqual(result, expected, 'binary format retained')
})
