var test = require('tape');
var convert = require('../');

test('properties', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['bar'],
    properties: {
      foo: {
        type: 'string',
        example: '2017-01-01T12:34:56Z'
      },
      bar: {
        type: 'string',
        nullable: true
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['bar'],
    properties: {
      foo: {
        type: 'string'
      },
      bar: {
        type: ['string', 'null']
      }
    }
  }

  assert.deepEqual(result, expected, 'converted')
})

test('properties value is null', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: null
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object'
  }

  assert.deepEqual(result, expected, 'successfully converted')
})

test('strips malformed properties children', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['bar'],
    properties: {
      foo: {
        type: 'string',
        example: '2017-01-01T12:34:56Z'
      },
      foobar: 2,
      bar: {
        type: 'string',
        nullable: true
      },
      baz: null
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['bar'],
    properties: {
      foo: {
        type: 'string'
      },
      bar: {
        type: ['string', 'null']
      }
    }
  }

  assert.deepEqual(result, expected, 'successfully converted')
})

test('additionalProperties is false', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        example: '2017-01-01T12:34:56Z'
      }
    },
    additionalProperties: false
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    },
    additionalProperties: false
  }

  assert.deepEqual(result, expected, 'properties converted')
})

test('additionalProperties is true', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        example: '2017-01-01T12:34:56Z'
      }
    },
    additionalProperties: true
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    },
    additionalProperties: true
  }

  assert.deepEqual(result, expected, 'properties converted')
})

test('additionalProperties is an object', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        example: '2017-01-01T12:34:56Z'
      }
    },
    additionalProperties: {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    },
    additionalProperties: {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      }
    }
  }

  assert.deepEqual(result, expected, 'properties and additionalProperties converted')
})
