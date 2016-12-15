import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as R from 'ramda';
import { FirebaseUtils } from './firebase-utils';

export const CHALLENGES_WATCHING_ON = 'CHALLENGES_WATCHING_ON';
export const CHALLENGES_WATCHING_OFF = 'CHALLENGES_WATCHING_OFF';
export const CHALLENGES_UPDATE = 'CHALLENGES_UPDATE';
export const CHALLENGES_CURRENT_CHANGED = 'CHALLENGES_CURRENT_CHANGED';

/**
 * ChallengeActions
 */
@inject(EventAggregator)
export class ChallengeActions {
  constructor(private ea: EventAggregator) { }

  changeCurrentChallenge(challenge) {
    // TODO: use the EventAggregator to send the same event to other parts of the system that care.
    // might need to make actions a class and use DI.
    this.ea.publish(CHALLENGES_CURRENT_CHANGED, challenge);

    return { type: CHALLENGES_CURRENT_CHANGED, payload: challenge };
  }
}

// export function changeCurrentChallenge(challenge) {
//   // TODO: use the EventAggregator to send the same event to other parts of the system that care.
//   // might need to make actions a class and use DI.
//   //let ea = aurelia.container.get(EventAggregator);

//   return { type: CHALLENGES_CURRENT_CHANGED, payload: challenge };
// }

function startWatchingChallenges() {
  return { type: CHALLENGES_WATCHING_ON };
}

export function stopWatchingChallenges() {
  return (dispatch, getState, firebase) => {
    firebase.database().ref('challenges').off();

    dispatch({ type: CHALLENGES_WATCHING_OFF });
  }
}

function updateChallenges(challenges) {
  return { type: CHALLENGES_UPDATE, payload: challenges };
}

function watchChallenges() {
  return (dispatch, getState, firebase) => {
    const dbRoot = firebase.database().ref();
    const challengesRef = dbRoot.child('challenges');

    challengesRef.on('value', snapshot => {
      let challenges = {};

      snapshot.forEach((challengeSnap) => {
        challenges[challengeSnap.key] = FirebaseUtils.recordFromSnapshot(challengeSnap);

        // materialize members for each challenge
        FirebaseUtils.collect(dbRoot, `challenges/${challengeSnap.key}/members`, 'users').then(members => {
          challenges[challengeSnap.key].members = members;
        });
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
