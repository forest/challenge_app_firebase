import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import * as firebase from 'firebase';
// import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers/root';
// import rootSaga from './sagas/root';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyA9dXbfzr2Sb8opG1rmOlcJViNu7p2ZrFk",
  authDomain: "dazzling-inferno-494.firebaseapp.com",
  databaseURL: "https://dazzling-inferno-494.firebaseio.com",
  storageBucket: "dazzling-inferno-494.appspot.com",
  messagingSenderId: "588204766300"
};
firebase.initializeApp(firebaseConfig);

function configureStore() {
  // const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    // compose(
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument(firebase),
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
