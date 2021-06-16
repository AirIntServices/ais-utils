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
 * @param {string} field field on each item of the array that will be used for grouping
 */
const groupBy = (items, field) => {
  const output = {};
  items.forEach((item) => {
    if (output[item[field]] === undefined) output[item[field]] = [];
    output[item[field]].push(item);
  });
  return output;
};

module.exports = {
  groupBy,
  oldGroupBy,
};
