var test = require('tape');
var convert = require('../');

test('removing readOnly prop', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      prop1: {
        type: 'string',
        readOnly: true
      },
      prop2: {
        type: 'string'
      }
    }
  }

  var result = convert(schema, { removeReadOnly: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      prop2: {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'readOnly prop removed')
})

test('removing readOnly prop even if keeping', function (assert) {

  assert.plan(1)

  var schema = {
    type: 'object',
    properties: {
      prop1: {
        type: 'string',
        readOnly: true
      },
      prop2: {
        type: 'string'
      }
    }
  }

  var result = convert(schema, {
    removeReadOnly: true,
    keepNotSupported: ['readOnly']
  })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      prop2: {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'readOnly prop removed')
})

test('removing writeOnly prop & required', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['prop1', 'prop2', 'prop3', 'prop4'],
    properties: {
      prop1: {
        type: 'string',
        writeOnly: true
      },
      prop2: {
        type: 'string',
        writeOnly: true
      },
      prop3: {
        type: 'string',
        writeOnly: true
      },
      prop4: {
        type: 'string'
      },
    }
  }

  var result = convert(schema, { removeWriteOnly: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['prop4'],
    properties: {
      prop4: {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'writeOnly props removed & updated required array')
})

test('removing readOnly from required', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['prop1', 'prop2', 'prop3', 'prop4'],
    properties: {
      prop1: {
        type: 'string'
      },
      prop2: {
        type: 'string',
        readOnly: true
      },
      prop3: {
        type: 'string',
        readOnly: true
      },
      prop4: {
        type: 'string'
      },
    }
  }

  var result = convert(schema, { removeReadOnly: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['prop1', 'prop4'],
    properties: {
      prop1: {
        type: 'string'
      },
      prop4: {
        type: 'string'
      },
    }
  }

  assert.deepEqual(result, expected, 'readOnly props removed & updated required array')
})

test('deleting required if empty', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['prop1'],
    properties: {
      prop1: {
        type: 'string',
        readOnly: true
      },
      prop2: {
        type: 'string'
      }
    }
  }

  var result = convert(schema, { removeReadOnly: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      prop2: {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'required removed')
})

test('deleting properties if empty', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['prop1'],
    properties: {
      prop1: {
        type: 'string',
        readOnly: true
      }
    }
  }

  var result = convert(schema, { removeReadOnly: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object'
  }

  assert.deepEqual(result, expected, 'properties removed')
})

test('not removing readOnly props by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['prop1', 'prop2'],
    properties: {
      prop1: {
        type: 'string',
        readOnly: true
      },
      prop2: {
        type: 'string'
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['prop1', 'prop2'],
    properties: {
      prop1: {
        type: 'string'
      },
      prop2: {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'readOnly props not removed')
})

test('not removing writeOnly props by default', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['prop1', 'prop2'],
    properties: {
      prop1: {
        type: 'string',
        writeOnly: true
      },
      prop2: {
        type: 'string'
      }
    }
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['prop1', 'prop2'],
    properties: {
      prop1: {
        type: 'string'
      },
      prop2: {
        type: 'string'
      }
    }
  }

  assert.deepEqual(result, expected, 'writeOnly props not removed')
})

test('deep schema', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'object',
    required: ['prop1', 'prop2'],
    properties: {
      prop1: {
        type: 'string',
        readOnly: true
      },
      prop2: {
        allOf: [
          {
            type: 'object',
            required: ['prop3'],
            properties: {
              prop3: {
                type: 'object',
                readOnly: true
              }
            }
          },
          {
            type: 'object',
            properties: {
              prop4: {
                type: 'object',
                readOnly: true
              }
            }
          }
        ]
      }
    }
  }

  var result = convert(schema, { removeReadOnly: true })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['prop2'],
    properties: {
      prop2: {
        allOf: [
          {
            type: 'object'
          },
          {
            type: 'object'
          }
        ]
      }
    }
  }

  assert.deepEqual(result, expected, 'writeOnly props not removed')
})
