const BATCH = 'BATCHING_REDUCER.BATCH';

/**
 * Dispatch a batch of redux actions
 * @param {*} action object or function to dispatch
 * @param {?string} type
 */
const handleInnerAction = (action, getState) => {
  if (Object.prototype.toString.call(action).slice(8, -1) === 'Object')
    return action;

  if (typeof action === 'function') {
    return new Promise((resolve) => {
      // Resolve on first dispatch
      const innerDispatch = (innerAction) =>
        resolve(handleInnerAction(innerAction, getState));

      // Resolve at function end
      return action(innerDispatch, getState).then(() => resolve());
    }).catch(() => {});
  }

  throw new Error('Invalid action');
};

/**
 * Dispatch a batch of redux actions
 * @param {array} actions array of redux action
 * @param {?string} type
 */
const batchActions =
  (actions, type = BATCH) =>
  async (dispatch, getState) => {
    const actionsToDispatch = await Promise.all(
      actions.map(async (action) => handleInnerAction(action, getState)),
    );

    return dispatch({
      type,
      meta: {
        batch: true,
      },
      payload: actionsToDispatch.filter(Boolean),
    });
  };

/**
 * Dispatch a batch of redux actions
 * @param {function} rootReducer reducer function
 */
const enableBatching = (rootReducer) => {
  const batchingReducer = (state, action) => {
    if (action && action.meta && action.meta.batch)
      return action.payload.reduce(batchingReducer, state);

    return rootReducer(state, action);
  };

  return batchingReducer;
};

module.exports = {
  enableBatching,
  batchActions,
  handleInnerAction,
};
