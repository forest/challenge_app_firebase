import { combineReducers } from 'redux';
import { RESET_ERROR_MESSAGE } from '../actions/errors';
import { challenges } from './challenges';
import { appState } from './app-state';
import { results } from './results';
import * as firebase from 'firebase';

function config() {
  return { firebase: firebase };
}

// Updates error message to notify about failed fetches.
function errorMessage(state = null, action) {
  const { type, payload, error } = action;

  if (type === RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return payload;
  }

  return state;
}

const rootReducer = combineReducers({
  config,
  errorMessage,
  challenges,
  appState,
  results
});

export default rootReducer;