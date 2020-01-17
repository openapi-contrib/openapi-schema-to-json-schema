var test = require('tape');
var convert = require('../');

test('remove discriminator by default', function (assert) {
  assert.plan(1)

  var schema = {
    oneOf: [
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'string'
          }
        }
      },
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'string'
          }
        }
      }
    ],
    discriminator: {
      propertyName: 'foo'
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    oneOf: [
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'string'
          }
        }
      },
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'string'
          }
        }
      }
    ]
  }

  assert.deepEqual(result, expected, 'discriminator removed')
})

test('remove readOnly by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      readOnly: {
        type: 'string',
        readOnly: true
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      readOnly: {
        type: 'string'
      }
    }
  }
  assert.deepEqual(result, expected, 'readOnly removed')
})

test('remove writeOnly by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      test: {
        type: 'string',
        writeOnly: true
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      test: {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'writeOnly removed')
})

test('remove xml by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        xml: {
          attribute: true
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
    }
  }

  assert.deepEqual(result, expected, 'xml removed')
})

test('remove externalDocs by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    },
    externalDocs: {
      url: 'http://foo.bar'
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
    }
  }

  assert.deepEqual(result, expected, 'externalDocs removed')
})

test('remove example by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    example: 'foo'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string'
  }

  assert.deepEqual(result, expected, 'example removed')
})

test('remove deprecated by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    deprecated: true
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string'
  }

  assert.deepEqual(result, expected, 'deprecated removed')
})

test('retaining fields', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      readOnly: {
        type: 'string',
        readOnly: true,
        example: 'foo'
      },
      anotherProp: {
        type: 'object',
        properties: {
          writeOnly: {
            type: 'string',
            writeOnly: true
          }
        }
      }
    },
    discriminator: 'bar'
  }

  var result = convert(schema, { keepNotSupported: ['readOnly', 'discriminator'] })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      readOnly: {
        type: 'string',
        readOnly: true
      },
      anotherProp: {
        type: 'object',
        properties: {
          writeOnly: {
            type: 'string'
          }
        }
      }
    },
    discriminator: 'bar'
  }

  assert.deepEqual(result, expected, 'example and writeOnly removed')
})
