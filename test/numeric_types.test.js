var test = require('tape')
var convert = require('../')

test('handles int32 format', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'integer',
    format: 'int32'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'integer',
    format: 'int32',
    minimum: 0 - Math.pow(2, 31),
    maximum: Math.pow(2, 31) - 1
  }

  assert.deepEqual(result, expected, 'int32 converted to minimum|maximum')
})

test('handles int32 format with specified minimum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int32',
		minimum: 500,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int32',
		minimum: 500,
		maximum: Math.pow(2, 31) - 1
	};

	assert.deepEqual(result, expected, 'int32 converted to minimum|maximum');
});

test('handles int32 format with specified minimum that\'s too small', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int32',
		minimum: -Math.pow(2, 32),
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int32',
		minimum: 0 - Math.pow(2, 31),
		maximum: Math.pow(2, 31) - 1
	};

	assert.deepEqual(result, expected, 'int32 converted to minimum|maximum');
});

test('handles int32 format with specified maximum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int32',
		maximum: 500,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int32',
		minimum: 0 - Math.pow(2, 31),
		maximum: 500
	};

	assert.deepEqual(result, expected, 'int32 converted to minimum|maximum');
});

test('handles int32 format with specified minimum that\'s too big', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int32',
		maximum: Math.pow(2, 32),
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int32',
		minimum: 0 - Math.pow(2, 31),
		maximum: Math.pow(2, 31) - 1
	};

	assert.deepEqual(result, expected, 'int32 converted to minimum|maximum');
});

test('handles int64 format', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'integer',
    format: 'int64'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'integer',
    format: 'int64',
    minimum: 0 - Math.pow(2, 63),
    maximum: Math.pow(2, 63) - 1
  }

  assert.deepEqual(result, expected, 'int64 converted to minimum|maximum')
})

test('handles int64 format with specified minimum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int64',
		minimum: 500,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int64',
		minimum: 500,
		maximum: Math.pow(2, 63) - 1
	};

	assert.deepEqual(result, expected, 'int64 converted to minimum|maximum');
});

test('handles int64 format with specified minimum that\'s too small', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int64',
		minimum: -Math.pow(2, 64),
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int64',
		minimum: 0 - Math.pow(2, 63),
		maximum: Math.pow(2, 63) - 1
	};

	assert.deepEqual(result, expected, 'int64 converted to minimum|maximum');
});

test('handles int64 format with specified maximum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int64',
		maximum: 500,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int64',
		minimum: 0 - Math.pow(2, 63),
		maximum: 500
	};

	assert.deepEqual(result, expected, 'int64 converted to minimum|maximum');
});

test('handles int64 format with specified minimum that\'s too big', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'integer',
		format: 'int64',
		maximum: Math.pow(2, 64),
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		format: 'int64',
		minimum: 0 - Math.pow(2, 63),
		maximum: Math.pow(2, 63) - 1
	};

	assert.deepEqual(result, expected, 'int64 converted to minimum|maximum');
});

test('handles float format', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'number',
    format: 'float'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'number',
    format: 'float',
    minimum: 0 - Math.pow(2, 128),
    maximum: Math.pow(2, 128) - 1
  }

  assert.deepEqual(result, expected, 'float converted to minimum|maximum')
})

test('handles float format with specified minimum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'number',
		format: 'float',
		minimum: 500,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'float',
		minimum: 500,
		maximum: Math.pow(2, 128) - 1
	};

	assert.deepEqual(result, expected, 'float converted to minimum|maximum');
});

test('handles float format with specified minimum that\'s too small', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'number',
		format: 'float',
		minimum: -Math.pow(2, 129),
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'float',
		minimum: 0 - Math.pow(2, 128),
		maximum: Math.pow(2, 128) - 1
	};

	assert.deepEqual(result, expected, 'float converted to minimum|maximum');
});

test('handles float format with specified maximum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'number',
		format: 'float',
		maximum: 500,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'float',
		minimum: 0 - Math.pow(2, 128),
		maximum: 500
	};

	assert.deepEqual(result, expected, 'float converted to minimum|maximum');
});

test('handles float format with specified minimum that\'s too big', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'number',
		format: 'float',
		maximum: Math.pow(2, 129),
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'float',
		minimum: 0 - Math.pow(2, 128),
		maximum: Math.pow(2, 128) - 1
	};

	assert.deepEqual(result, expected, 'float converted to minimum|maximum');
});

test('handles double format', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'number',
    format: 'double'
  }

  var result = convert(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'number',
    format: 'double',
    minimum: 0 - Number.MAX_VALUE,
    maximum: Number.MAX_VALUE
  }

  assert.deepEqual(result, expected, 'double converted to minimum|maximum')
})

test('handles double format with specified minimum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'number',
		format: 'double',
		minimum: 50.5,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'double',
		minimum: 50.5,
		maximum: Number.MAX_VALUE - 1
	};

	assert.deepEqual(result, expected, 'double converted to minimum|maximum');
});

test('handles double format with specified maximum', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'number',
		format: 'double',
		maximum: 50.5,
	};

	result = convert(schema);

	expected = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'number',
		format: 'double',
		minimum: 0 - Number.MAX_VALUE,
		maximum: 50.5
	};

	assert.deepEqual(result, expected, 'double converted to minimum|maximum');
});
