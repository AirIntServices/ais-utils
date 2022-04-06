Batch redux actions
=====================

## Usage

```js
import {createStore, applyMiddleware} from 'redux';
import {batchActions, enableBatching} from 'redux-batched-actions';
import {createAction} from 'redux-actions';

const doThing = createAction('DO_THING')
const doOther = createAction('DO_OTHER')

function reducer(state, action) {
	switch (action.type) {
		case 'DO_THING': return 'thing'
		case 'DO_OTHER': return 'other'
		default: return state
	}
}

// Handle bundled actions in reducer
const store = createStore(enableBatching(reducer), initialState)

// Use "BATCHING_REDUCER.BATCH" type 
store.dispatch(batchActions([doThing(), doOther()]))
// OR use a custom type
store.dispatch(batchActions([doThing(), doOther()], 'DO_BOTH'))
```


### Handle async actions
Dispatched action can be async function. All promises need to be resolved before the batch is dispatched. Promises are resolved at the first dispatch. If an action didn't dispatch anything, the action is resolved when the action is finished.
```js
const doThing = () => async (dispatch) => {
    const payload = await someFunction()
    dispatch({
        type: 'DO_THING',
        payload,
    })
}

store.dispatch(batchActions([doThing(), doOther()]))
```

### Handle nested dispatch
Action can only have one dispatch. If you need to do multiple dispatch in the same action, you can make nested dispatch.
```js
const doThing = () => (dispatch) => 
    dispatch(batchActions([doAnother(), doOther()]))

store.dispatch(batchActions([doThing(), doOther()]))
```