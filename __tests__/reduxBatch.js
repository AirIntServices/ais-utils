const {
  batchActions,
  enableBatching,
  handleInnerAction,
} = require('../reduxBatch');
const { sleep } = require('../index');

const action1 = { type: 'ACTION_1' };
const action2 = { type: 'ACTION_2' };

describe('batching actions', () => {
  it('wraps actions in a batch action', async () => {
    const result = await batchActions([action1, action2])((action) => action);
    expect(result).toEqual({
      type: 'BATCHING_REDUCER.BATCH',
      meta: { batch: true },
      payload: [action1, action2],
    });
  });

  it('uses a custom type, if provided', async () => {
    const result = await batchActions(
      [action1, action2],
      'CUSTOM_ACTION',
    )((action) => action);
    expect(result).toEqual({
      type: 'CUSTOM_ACTION',
      meta: { batch: true },
      payload: [action1, action2],
    });
  });
});

describe('enabling batching', () => {
  it('passes actions through that are not batched', () => {
    const reducer = jest.fn();
    const batchedReducer = enableBatching(reducer);
    batchedReducer(0, action1);
    expect(reducer).toHaveBeenCalledTimes(1);
  });

  it('passes actions through that are batched', async () => {
    const batchedActions = await batchActions([action1, action2])(
      (action) => action,
    );
    const reducer = jest.fn();
    const batchedReducer = enableBatching(reducer);
    batchedReducer(0, batchedActions);
    expect(reducer).toHaveBeenCalledTimes(2);
  });

  it('handles nested batched actions', async () => {
    const batchedActions = await batchActions([action1, action2])(
      (action) => action,
    );
    const nestedActions = await batchActions([batchedActions, action2])(
      (action) => action,
    );
    const reducer = jest.fn();
    const batchedReducer = enableBatching(reducer);
    batchedReducer(0, nestedActions);

    expect(reducer).toHaveBeenCalledTimes(3);
  });
});

describe('handle action', () => {
  it('handles object actions', async () => {
    const result = await handleInnerAction(action1);
    expect(result).toEqual(action1);
  });

  it('handles function actions', async () => {
    const funcAction = (dispatch) => {
      dispatch(action1);
    };
    const result = await handleInnerAction(funcAction);
    expect(result).toEqual(action1);
  });

  it('handles async function actions', async () => {
    const asyncAction = async (dispatch) => {
      await sleep(500);
      dispatch(action1);
    };
    const result = await handleInnerAction(asyncAction);
    expect(result).toEqual(action1);
  });

  it('handles function actions without dispatch', async () => {
    const asyncAction = async () => {
      await sleep(500);
    };
    const result = await handleInnerAction(asyncAction);
    expect(result).toEqual(undefined);
  });

  it('handles function actions throwing errors', async () => {
    const funcAction = () => {
      throw new Error();
    };
    const result = await handleInnerAction(funcAction);
    expect(result).toEqual(undefined);
  });

  it('throw an error for invalid actions', async () => {
    expect(() => handleInnerAction('action')).toThrow('Invalid action');
  });
});
