import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as createLogger from 'redux-logger';
import thunk from 'redux-thunk';
// import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers/root';
// import rootSaga from './sagas/root';

function configureStore() {
  // const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    // compose(
    composeWithDevTools(
      applyMiddleware(
        thunk,
        // sagaMiddleware,
        createLogger()
      )
    )
  )

  // sagaMiddleware.run(rootSaga);
  return store;
}

export const reduxStore = configureStore();
