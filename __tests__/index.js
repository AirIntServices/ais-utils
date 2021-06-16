const { groupBy, oldGroupBy } = require('../index');

describe('Testing idempotence of groupBy and fastGroupBy', () => {
  test('behaves the same when passing empty array', () => {
    const arr = [];
    expect(groupBy(arr)).toEqual(oldGroupBy(arr));
  });

  test('behaves the same for grouping simple array', () => {
    const arr = [
      { foo: 1, bar: 'A' },
      { foo: 1, bar: 'B' },
      { foo: 2, bar: 'C' },
    ];
    const fieldName = 'foo';
    expect(groupBy(arr, fieldName)).toEqual(oldGroupBy(arr, fieldName));
  });

  test('behaves the same when grouping by non existing field', () => {
    const arr = [
      { foo: 1, bar: 'A' },
      { foo: 1, bar: 'B' },
      { foo: 2, bar: 'C' },
    ];
    const fieldName = 'baz';
    expect(groupBy(arr, fieldName)).toEqual(oldGroupBy(arr, fieldName));
  });
});
