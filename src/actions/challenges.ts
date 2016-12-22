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

  stopWatchingChallenges(user) {
    return (dispatch, getState, firebase) => {
      firebase.database().ref(`users/${user.uid}/challenges`).off();

      dispatch({ type: CHALLENGES_WATCHING_OFF });
    }
  }

  private updateChallenges(challenges) {
    return { type: CHALLENGES_UPDATE, payload: challenges };
  }

  private watchChallenges(user) {
    return (dispatch, getState, firebase) => {
      const state = getState();
      const dbRoot = firebase.database().ref();
      const challengesRef = dbRoot.child(`users/${user.uid}/challenges`);

      challengesRef.on('value', snapshot => {
        // load all challenges this user is a member of
        FirebaseUtils.collect(dbRoot, `users/${user.uid}/challenges`).then(collected => {
          let challenges = R.reduce((obj, challenge) => {
            obj[challenge.key] = challenge;
            return obj;
          }, {}, collected);

          dispatch(this.updateChallenges(challenges));
          return challenges;
        }).then(challenges => {
          // load all user profiles for each challenge
          R.keys(challenges).map(key => {
            FirebaseUtils.collect(dbRoot, `challenges/${key}/members`, 'users').then(collected => {
              let indexedMembers = R.reduce((obj, member) => {
                obj[member.key] = member;
                return obj;
              }, {}, collected);

              dispatch(loadUsers(indexedMembers));
            })
          });
          return challenges;
        }).then(challenges => {
          // auto select the first challenge if not set
          if (!getCurrentChallenge(state)) {
            let first = R.head(R.values(challenges))
            if (first) {
              dispatch(this.changeCurrentChallenge(first));
            }
          }
        }).catch(error => {
          // TODO: figure out good way to do error handling
          console.log(error.message);
          throw new Error(error.message);
        });
      });

      return Promise.resolve();
    }
  }

  private shouldLoadChallenges(user, state) {
    return (user && !state.challenges.watching);
  }

  loadChallenges(user) {
    return (dispatch, getState) => {
      const state = getState();

      if (this.shouldLoadChallenges(user, state)) {
        dispatch(this.startWatchingChallenges());
        dispatch(this.watchChallenges(user));
      } else {
        // Let the calling code know there's nothing to wait for.
        return Promise.resolve();
      }
    }
  }
}
