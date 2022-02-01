const { groupBy, oldGroupBy, resolvePath, sortByFields } = require('../index');

describe('Testing idempotence of groupBy and oldGroupBy', () => {
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

  test('behaves the same for grouping simple array with a function as field', () => {
    const arr = [
      { foo: 1, bar: 'A' },
      { foo: 1, bar: 'B' },
      { foo: 2, bar: 'C' },
    ];
    const fieldName = 'foo';
    expect(groupBy(arr, (item) => item[fieldName])).toEqual(
      oldGroupBy(arr, fieldName),
    );
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

describe('resolvePath', () => {
  it('should return nested value', () => {
    expect(resolvePath({ a: { b: 'c' } }, 'a.b')).toEqual('c');
  });
  it('should return undefined for wrong path', () => {
    expect(resolvePath({ a: { c: 'c' } }, 'a.b.c')).toEqual(undefined);
  });
});

describe('sortByFields', () => {
  const array = [
    {
      line: 1,
      page: 1,
      test: 'a',
    },
    {
      line: 2,
      page: 1,
      test: 'A',
    },
    {
      line: 4,
      page: 1,
      test: 2,
    },
    {
      line: 3,
      page: 2,
      test: 'B',
    },
    {
      line: 4,
      page: 1,
      test: 1,
    },
  ];

  it('should return sort by page ASC', () => {
    expect(sortByFields(array, ['page', 'ASC'])).toMatchSnapshot();
    expect(sortByFields(array, 'page')).toMatchSnapshot();
  });
  it('should return sort by page ASC AND line ASC', () => {
    expect(
      sortByFields(array, ['page', 'ASC'], ['line', 'ASC']),
    ).toMatchSnapshot();
    expect(sortByFields(array, 'page', 'line')).toMatchSnapshot();
  });

  it('should return sort by page DESC', () => {
    expect(sortByFields(array, ['page', 'DESC'])).toMatchSnapshot();
  });
  it('should return sort by page DESC AND line DESC', () => {
    expect(
      sortByFields(array, ['page', 'DESC'], ['line', 'DESC']),
    ).toMatchSnapshot();
  });

  it('should return sort by page ASC AND line DESC', () => {
    expect(
      sortByFields(array, ['page', 'ASC'], ['line', 'DESC']),
    ).toMatchSnapshot();
  });
  it('should return sort by page DESC AND line ASC', () => {
    expect(
      sortByFields(array, ['page', 'DESC'], ['line', 'ASC']),
    ).toMatchSnapshot();
  });

  it('should return sort by test DESC AND case sensitive', () => {
    expect(sortByFields(array, ['test', 'DESC'])).toMatchSnapshot();
  });
  it('should return sort by test DESC AND not case sensitive', () => {
    expect(sortByFields(array, ['test', 'DESC'], false)).toMatchSnapshot();
  });

  it('should ignore nonexisting parameters', () => {
    expect(sortByFields(array, 'c', 'line', 'page')).toMatchSnapshot();
  });
});
