var test = require('tape');
var convert = require('../');

test('handling additional properties of the same type: string', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: false,
    patternProperties: {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties set to false')
})

test('handling additional properties of the same type: number', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'number'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'number'
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: false,
    patternProperties: {
      '^[a-z]*$': {
        type: 'number'
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties set to false')
})

test('handling additional properties with one of patternProperty types', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'number'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'number'
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: false,
    patternProperties: {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'number'
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties set to false')
})

test('handling additionalProperties with matching objects', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        }
      }
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: false,
    patternProperties: {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties set to false')
})

test('handling null x-patternProperties', function (assert) {

  assert.plan(2)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        }
      }
    },
    'x-patternProperties': null
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        }
      }
    }
  }

  assert.deepEqual(result['x-patternProperties'], void 0, 'x-patternProperties to be gone')
  assert.deepEqual(result, expected, 'additionalProperties to be preserved')
})

test('handling additionalProperties with non-matching objects', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        }
      }
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'object',
        properties: {
          test: {
            type: 'integer'
          }
        }
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        }
      }
    },
    patternProperties: {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'object',
        properties: {
          test: {
            type: 'integer'
          }
        }
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties not changed')
})

test('handling additionalProperties with matching array', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: false,
    patternProperties: {
      '^[a-z]*$': {
        type: 'string'
      },
      '^[A-Z]*$': {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties set to false')
})

test('handling additionalProperties with composition types', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      oneOf: [
        {
          type: 'string'
        },
        {
          type: 'integer'
        }
      ]
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        oneOf: [
          {
            type: 'string'
          },
          {
            type: 'integer'
          }
        ]
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: false,
    patternProperties: {
      '^[a-z]*$': {
        oneOf: [
          {
            type: 'string'
          },
          {
            type: 'integer'
          }
        ]
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties set to false')
})

test('not supporting patternProperties', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: false })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'nothing done')
})

test('not supporting patternProperties by default', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'nothing done')
})

test('setting custom patternProperties handler', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  var result = convert(schema, {
    supportPatternProperties: true,
    patternPropertiesHandler: function (schema) {
      schema.patternProperties = false
      return schema
    }
  })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    patternProperties: false
  }

  assert.deepEqual(result, expected, 'handler with custom handler')
})

test('additionalProperties not modified if set to true', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    additionalProperties: true,
    'x-patternProperties': {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  var result = convert(schema, { supportPatternProperties: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    additionalProperties: true,
    patternProperties: {
      '^[a-z]*$': {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'additionalProperties not removed')
})
