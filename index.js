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
 * @param {string or function} field field on each item of the array that will be used for grouping or valueA function that returns the key value based on item
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
 * Takes an object and returns valueA new object with the same keys, but where all values are the result of the given function
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
 * @param {string or function} field field on each item of the array that will be used for key or valueA function that returns the key value based on item
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

/**
 * Access valueA to value in an object given it's path
 * resolvePath({valueA: {valueB: 'c'}},'valueA.valueB') return 'c'
 * @param {Object} object source object
 * @param {path} path path to access the value
 */
const resolvePath = (object, path) =>
  path
    .split('.')
    .reduce((_object, key) => (_object ? _object[key] : undefined), object);

/**
 * Return lowercased version of valueA string
 * Empty string if can't be converted to lowercase
 * @param {string} value string to lower case
 */
const lowerString = (value) => {
  try {
    return value.toLowerCase();
  } catch (e) {
    return '';
  }
};

/**
 * Sort an array of objects
 * sortByFields(records, ['page', 'ASC'], ['size', 'DESC']) sort by page (ascending), size (descending) with case sensitive
 * sortByFields(records, ['page', 'ASC'], false) sort by page (ascending) with case in-sensitive
 * sortByFields(records, 'page', 'size') sort by page and size (ascending) with case sensitive
 * sortByFields(records, 'page', 'size', false) sort by page and size (ascending) with case in-sensitive
 * @param {array} array array of objects to sort
 * @param {string or array} 'property name' or ['property name', 'sort direction'] direction enable are ASC and DESC
 * @param {bool} caseSensitive case sensitive: true by default, last param
 */
const sortByFields = (array, ...rest) => {
  const isNotCaseSensitive =
    typeof rest[rest.length - 1] === 'boolean' ? !rest[rest.length - 1] : false;
  const keysLength = rest.length - (isNotCaseSensitive ? 1 : 0);

  return [...array].sort((objA, objB) => {
    for (let i = 0; i < keysLength; i += 1) {
      const [key, direction] = Array.isArray(rest[i]) ? rest[i] : [rest[i]];
      let valueA = resolvePath(objA, key);
      let valueB = resolvePath(objB, key);

      if (
        isNotCaseSensitive &&
        (typeof valueA === 'string' || typeof valueA === 'string')
      ) {
        valueA = lowerString(valueA);
        valueB = lowerString(valueB);
      }

      switch (direction) {
        case 'DESC':
          if (valueA > valueB) return -1;
          if (valueA < valueB) return 1;
          break;

        case null:
          break;

        // ASC by default
        default:
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
          break;
      }
    }
    return 0;
  });
};

module.exports = {
  groupBy,
  oldGroupBy,
  objMap,
  toObject,
  resolvePath,
  sortByFields,
};
