/**
 * !! DEPRECATED !!
 * Please use groupBy for any new use
 * This one is left here for backwards compatibility testing purpose, but is too slow
 * @param {array} items array of items that should be grouped
 * @param {string} field field on each item of the array that will be used for grouping
 */
const oldGroupBy = (items, field) =>
  items.reduce((finalResult, item) => {
    if (item) {
      const previousArray = finalResult[item[field]];
      if (previousArray === undefined) {
        return {
          ...finalResult,
          [item[field]]: [item],
        };
      }
      return {
        ...finalResult,
        [item[field]]: [...previousArray, item],
      };
    }
    return finalResult;
  }, {});

/**
 * Takes an array and groups its values into an object where keys are the distinct values of the given field, and values are arrays containing the items matching these values
 * The reduce implementation is very much slower, so we had to switch back to the good old loop approach for this one
 * @param {array} items array of items that should be grouped
 * @param {string or function} field field on each item of the array that will be used for grouping or a function that returns the key value based on item
 */
const groupBy = (items, field) => {
  const output = {};
  items.forEach((item) => {
    const key =
      Object.prototype.toString.call(field) === '[object Function]'
        ? field(item)
        : item[field];
    if (output[key] === undefined) output[key] = [];
    output[key].push(item);
  });
  return output;
};

/**
 * Takes an object and returns a new object with the same keys, but where all values are the result of the given function
 * @param {Object} obj the source object
 * @param {function} func the function that will be called for all entries of the source object. First param is the value, second optional param is the key.
 */
const objMap = (obj, func) =>
  Object.entries(obj).reduce((output, [key, value]) => {
    return { ...output, [key]: func(value, key) };
  }, {});

/**
 * Takes an array and turn it into an object where keys are the values of the given field, and values are the items
 * @param {array} items array of items
 * @param {string or function} field field on each item of the array that will be used for key or a function that returns the key value based on item
 */
const toObject = (items, field) => {
  const output = {};
  items.forEach((item) => {
    const key =
      Object.prototype.toString.call(field) === '[object Function]'
        ? field(item)
        : item[field];
    output[key] = item;
  });
  return output;
};

module.exports = {
  groupBy,
  oldGroupBy,
  objMap,
  toObject,
};
