import * as firebase from 'firebase';
import { recordFromSnapshot } from './firebase-utils';
import * as R from 'ramda';

export const CHALLENGES_WATCHING_ON = 'CHALLENGES_WATCHING_ON';
export const CHALLENGES_WATCHING_OFF = 'CHALLENGES_WATCHING_OFF';
export const CHALLENGES_UPDATE = 'CHALLENGES_UPDATE';
export const CHALLENGES_CURRENT_CHANGED = 'CHALLENGES_CURRENT_CHANGED';

export function changeCurrentChallenge(challenge) {
  return { type: CHALLENGES_CURRENT_CHANGED, payload: challenge };
}

function startWatchingChallenges() {
  return { type: CHALLENGES_WATCHING_ON };
}

export function stopWatchingChallenges() {
  return (dispatch, getState) => {
    const state = getState();

    state.config.firebase.ref('challenges').off();

    dispatch({ type: CHALLENGES_WATCHING_OFF });
  }
}

function updateChallenges(challenges) {
  return { type: CHALLENGES_UPDATE, payload: challenges };
}

function watchChallenges() {
  return (dispatch, getState) => {
    const state = getState();
    const challengesRef = state.config.firebase.ref('challenges');

    challengesRef.on('value', snapshot => {
      let challenges = {};

      snapshot.forEach(challengeSnap => {
        challenges[challengeSnap.key] = challengeSnap.val();
      });

      dispatch(updateChallenges(challenges));
    });

    return Promise.resolve();
  }
}

function shouldLoadChallenges(state) {
  return !state.challenges.watching;
}

export function loadChallenges() {
  return (dispatch, getState) => {
    const state = getState();

    if (shouldLoadChallenges(state)) {
      dispatch(startWatchingChallenges());
      dispatch(watchChallenges());
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  }
}
