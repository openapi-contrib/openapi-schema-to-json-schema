var test = require('tape');
var convert = require('../');

test('converting a minimal OpenAPI 3.0 parameter', function (assert) {
  assert.plan(1)

  var schema = {
    name: 'parameter name',
    in: 'cookie',
    schema: {
      type: 'string',
      nullable: true
    }
  }

  var result = convert.fromParameter(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null']
  }

  assert.deepEqual(result, expected, 'OpenAPI 3.0 parameter converted')
})

test('converting an extensive OpenAPI 3.0 parameter', function (assert) {
  assert.plan(1)

  var schema = {
    name: 'parameter name',
    in: 'cookie',
    schema: {
      type: 'string',
      nullable: true
    },
    required: true,
    allowEmptyValue: true,
    deprecated: true,
    allowReserved: true,
    style: 'matrix',
    explode: true,
    example: 'parameter example'
  }

  var result = convert.fromParameter(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null']
  }

  assert.deepEqual(result, expected, 'OpenAPI 3.0 parameter converted')
})

test('converting a OpenAPI 3.0 parameter with MIME schemas', function (assert) {
  assert.plan(1)

  var schema = {
    name: 'parameter name',
    in: 'cookie',
    content: {
      'application/javascript': {
        schema: {
          type: 'string',
          nullable: true
        }
      },
      'text/css': {
        schema: {
          type: 'string',
          nullable: true
        }
      }
    }
  }

  var result = convert.fromParameter(schema)

  var expected = {
    'application/javascript': {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: ['string', 'null']
    },
    'text/css': {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: ['string', 'null']
    }
  }

  assert.deepEqual(result, expected, 'parameter MIMEs schemas converted')
})

test('converting a OpenAPI 3.0 parameter with MIMEs without a schema', function (assert) {
  assert.plan(1)

  var schema = {
    name: 'parameter name',
    in: 'cookie',
    content: {
      'application/javascript': {
        schema: {
          type: 'string',
          nullable: true
        }
      },
      'text/css': {}
    }
  }

  var result = convert.fromParameter(schema)

  var expected = {
    'application/javascript': {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: ['string', 'null']
    },
    'text/css': {
      $schema: 'http://json-schema.org/draft-04/schema#'
    }
  }

  assert.deepEqual(result, expected, 'MIME without a schema converted')
})

test('using a OpenAPI 3.0 parameter description', function (assert) {
  assert.plan(1)

  var schema = {
    name: 'parameter name',
    in: 'cookie',
    description: 'parameter description',
    schema: {
      description: 'schema description'
    }
  }

  var result = convert.fromParameter(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'parameter description'
  }

  assert.deepEqual(result, expected, 'parameter description used')
})

test('throwing on OpenAPI 3.0 parameters without schemas', function (assert) {
  assert.plan(1)

  var schema = {
    name: 'parameter name',
    in: 'cookie'
  }

  assert.throws(function () { convert.fromParameter(schema) }, /InvalidInputError/)
})

test('doesnt throw for parameters without schemas with stricMode disabled', function (assert) {
  assert.plan(1)

  var schema = {
    name: 'parameter name',
    in: 'cookie'
  }

  var result = convert.fromParameter(schema, { strictMode: false })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#'
  }

  assert.deepEqual(result, expected, 'parameter description used')
})
