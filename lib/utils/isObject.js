exports.isObject = function (maybeObj) {
  return maybeObj !== null && typeof maybeObj === 'object' && Array.isArray(maybeObj) === false
}
