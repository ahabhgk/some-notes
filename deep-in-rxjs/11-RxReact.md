# Rx 驱动 React

使用 Subject 类似 EventBus 实现数据交互

## Rx 实现 Redux

```ts
interface Action<T = any> {
  type: T,
}
interface AnyAction extends Action {
  [key: string]: any,
}
type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S
interface Store<S, A extends Action = AnyAction> {
  getState(): S,
  dispatch(action: A): A,
  subscribe(listener: () => void): () => void,
}
const createStore = <S, A extends Action>(reducer: Reducer<S, A>, initialState: S): Store<S, A> => {
  const action$ = new Subject<A>()
  let currentState = initialState
  const store$ = action$.pipe(
    startWith(initialState as unknown as A),
    scan(reducer),
    tap((state) => currentState = state),
  )

  return {
    getState: () => currentState,
    dispatch: (action) => {
      action$.next(action)
      return action
    },
    subscribe: (listener) => {
      const subscription = store$.subscribe(listener)
      return () => {
        subscription.unsubscribe()
      }
    }
  }
}

const incrAction = {
  type: 'incr'
}
const decrAction = {
  type: 'decr'
}
const initialState = { num: 0 }

type CountActions = typeof incrAction | typeof decrAction

const re = (state = initialState, action: CountActions) => {
  switch (action.type) {
    case 'incr':
      return { num: state.num + 1 }
    case 'decr':
      return { num: state.num - 1 }
    default:
      return state
  }
}

const store = createStore(re, initialState)
store.subscribe(console.log)
store.dispatch(incrAction)
```
