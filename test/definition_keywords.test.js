var test = require('tape');
var convert = require('..');

test('handles conversion in keywords specified in additionalKeywords', function (assert) {
  assert.plan(1)

  var schema = {
    definitions: {
      sharedDefinition: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            nullable: true
          }
        }
      }
    }
  }

  var result = convert(schema, {
    definitionKeywords: ['definitions']
  })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    definitions: {
      sharedDefinition: {
        type: 'object',
        properties: {
          foo: {
            type: ['string', 'null']
          }
        }
      }
    }
  }

  assert.deepEqual(result, expected)
})
