var test = require('tape');
var convert = require('../');

test('iterates allOfs', function (assert) {
  assert.plan(1)

  var schema = {
    allOf: [
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'integer'
          }
        }
      },
      {
        allOf: [
          {
            type: 'number'
          }
        ]
      }
    ]
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    allOf: [
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'integer'
          }
        }
      },
      {
        allOf: [
          {
            type: 'number'
          }
        ]
      }
    ]
  }

  assert.deepEqual(result, expected, 'iterated allOfs')
})

test('iterates anyOfs', function (assert) {
  assert.plan(1)

  var schema = {
    anyOf: [
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'integer'
          }
        }
      },
      {
        anyOf: [
          {
            type: 'object',
            properties: {
              bar: {
                type: 'number'
              }
            }
          }
        ]
      }
    ]
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    anyOf: [
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'integer'
          }
        }
      },
      {
        anyOf: [
          {
            type: 'object',
            properties: {
              bar: {
                type: 'number'
              }
            }
          }
        ]
      }
    ]
  }

  assert.deepEqual(result, expected, 'anyOfs iterated')
})

test('iterates oneOfs', function (assert) {
  assert.plan(1)

  var schema = {
    oneOf: [
      {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'integer'
          }
        }
      },
      {
        oneOf: [
          {
            type: 'object',
            properties: {
              bar: {
                type: 'number'
              }
            }
          }
        ]
      }
    ]
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
            type: 'integer'
          }
        }
      },
      {
        oneOf: [
          {
            type: 'object',
            properties: {
              bar: {
                type: 'number'
              }
            }
          }
        ]
      }
    ]
  }

  assert.deepEqual(result, expected, 'oneOfs iterated')
})

test('converts types in not', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      not: {
        type: 'string',
        minLength: 8
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      not: {
        type: 'string',
        minLength: 8
      }
    }
  }

  assert.deepEqual(result, expected, 'not handled')
})

test('converts types in not', function (assert) {
  assert.plan(1)

  var schema = {
    not: {
      type: 'string',
      minLength: 8
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    not: {
      type: 'string',
      minLength: 8
    }
  }

  assert.deepEqual(result, expected, 'not handled')
})

test('nested combination keywords', function (assert) {
  assert.plan(1)

  var schema = {
    anyOf: [
      {
        allOf: [
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string',
                nullable: true
              }
            }
          },
          {
            type: 'object',
            properties: {
              bar: {
                type: 'integer',
                nullable: true
              }
            }
          }
        ]
      },
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          }
        }
      },
      {
        not: {
          type: 'string',
          example: 'foobar'
        }
      }
    ]
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    anyOf: [
      {
        allOf: [
          {
            type: 'object',
            properties: {
              foo: {
                type: ['string', 'null']
              }
            }
          },
          {
            type: 'object',
            properties: {
              bar: {
                type: ['integer', 'null']
              }
            }
          }
        ]
      },
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          }
        }
      },
      {
        not: {
          type: 'string'
        }
      }
    ]
  }

  assert.deepEqual(result, expected, 'nested combination keywords')
})
