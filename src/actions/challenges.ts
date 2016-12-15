import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as R from 'ramda';
import { FirebaseUtils } from './firebase-utils';
import { loadUsers } from './users';
import { getCurrentChallenge } from '../reducers/selectors';

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

  private startWatchingChallenges() {
    return { type: CHALLENGES_WATCHING_ON };
  }

  stopWatchingChallenges() {
    return (dispatch, getState, firebase) => {
      firebase.database().ref('challenges').off();

      dispatch({ type: CHALLENGES_WATCHING_OFF });
    }
  }

  private updateChallenges(challenges) {
    return { type: CHALLENGES_UPDATE, payload: challenges };
  }

  private watchChallenges() {
    return (dispatch, getState, firebase) => {
      const state = getState();
      const dbRoot = firebase.database().ref();
      const challengesRef = dbRoot.child('challenges');

      challengesRef.on('value', snapshot => {
        let challenges = {};

        snapshot.forEach((challengeSnap) => {
          challenges[challengeSnap.key] = FirebaseUtils.recordFromSnapshot(challengeSnap);

          // load all user profiles for each challenge
          FirebaseUtils.collect(dbRoot, `challenges/${challengeSnap.key}/members`, 'users').then(members => {
            let indexedMembers = R.reduce((obj, member) => {
              obj[member.key] = member;
              return obj;
            }, {}, members);
            dispatch(loadUsers(indexedMembers));
          });
        });

        dispatch(this.updateChallenges(challenges));

        // auto select the first challenge if not set
        if (!getCurrentChallenge(state)) {
          let first = R.head(R.values(challenges))
          if (first) {
            dispatch(this.changeCurrentChallenge(first));
          }
        }
      });

      return Promise.resolve();
    }
  }

  private shouldLoadChallenges(state) {
    return !state.challenges.watching;
  }

  loadChallenges() {
    return (dispatch, getState) => {
      const state = getState();

      if (this.shouldLoadChallenges(state)) {
        dispatch(this.startWatchingChallenges());
        dispatch(this.watchChallenges());
      } else {
        // Let the calling code know there's nothing to wait for.
        return Promise.resolve();
      }
    }
  }
}