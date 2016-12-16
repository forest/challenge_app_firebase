import * as R from 'ramda';
import { Types } from '../types'

export function trackIncrement(user: Types.IAuthenticatedUser, challenge: Types.IChallenge) {
  return (dispatch, getState, firebase) => {
    if (challenge) {
      let newResult = firebase.database().ref(`results/${challenge.key}`).push();
      newResult.set({
        uid: user.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    }
  }
}

export function trackDecrement(user: Types.IAuthenticatedUser, challenge: Types.IChallenge) {
  return (dispatch, getState, firebase) => {
    if (challenge) {
      firebase.database().ref(`results/${challenge.key}`).orderByChild('uid').equalTo(user.uid).once('value').then(snapshot => {
        let results = [];
        snapshot.forEach(resultSnapshot => {
          results.push(resultSnapshot);
        });

        // delete the last result
        let last = R.last(results);
        if (last) {
          last.ref.remove().then(() => {
            return true;
          })
        }
      });
    }
  }
}
