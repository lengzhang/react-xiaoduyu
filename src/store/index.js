import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

let middleware = [ thunk ];

// 如果是在客户端环境，并且是开发模式，那么打印redux日志
if (!process.env.__NODE__ && __DEV__) middleware.push(createLogger());

const composeEnhancers = !process.env.__NODE__ && __DEV__ ? composeWithDevTools : compose;

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
    )
  )
  return store;
}
