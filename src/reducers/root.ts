import { combineReducers } from 'redux';
import { RESET_ERROR_MESSAGE } from '../actions/errors';
// import * as firebase from 'firebase';
import { currentChallenge, challenges } from './challenges';

// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCtbreB2eYuPzbZp0bw_dDQeEEsXKoCnxs",
//   authDomain: "dash-of-agile-dev.firebaseapp.com",
//   databaseURL: "https://dash-of-agile-dev.firebaseio.com",
//   storageBucket: "dash-of-agile-dev.appspot.com",
//   messagingSenderId: "751084256112"
// };
// firebase.initializeApp(firebaseConfig);
// const firebaseRef = firebase.database();

// function config() {
//   return { firebase: firebaseRef };
// }

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
  // config,
  errorMessage,
  challenges,
  currentChallenge
});

export default rootReducer;