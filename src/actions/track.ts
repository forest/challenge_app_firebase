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
  // return { type: TRACK_DECREMENT, payload: {"user": user, "challenge": challenge} };
}
