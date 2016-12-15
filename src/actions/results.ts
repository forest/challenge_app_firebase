import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as R from 'ramda';
import { Types } from '../types';

export const RESULTS_WATCHING_ON = 'RESULTS_WATCHING_ON';
export const RESULTS_WATCHING_OFF = 'RESULTS_WATCHING_OFF';
export const RESULTS_UPDATE = 'RESULTS_UPDATE';

/**
 * ResultActions
 */
@inject(EventAggregator)
export class ResultActions {
  constructor(private ea: EventAggregator) { }

  private startWatchingResults() {
    return { type: RESULTS_WATCHING_ON };
  }

  stopWatchingResults(challenge: Types.IChallenge) {
    return (dispatch, getState, firebase) => {
      if (challenge) {
        firebase.database().ref(`results/${challenge.key}`).off();
      }

      dispatch({ type: RESULTS_WATCHING_OFF });
    }
  }

  private updateResults(challenge: Types.IChallenge, results) {
    return { type: RESULTS_UPDATE, payload: { challenge: challenge, results: results } };
  }

  private watchResults(challenge: Types.IChallenge) {
    return (dispatch, getState, firebase) => {
      const state = getState();
      const resultsRef = firebase.database().ref(`results/${challenge.key}`);

      resultsRef.on('value', snapshot => {
        let results = {};

        snapshot.forEach(resultSnap => {
          results[resultSnap.key] = resultSnap.val();
        });

        dispatch(this.updateResults(challenge, results));
      });

      return Promise.resolve();
    }
  }

  private shouldLoadResults(state) {
    return !state.results.watching;
  }

  loadResults(challenge: Types.IChallenge) {
    return (dispatch, getState) => {
      const state = getState();

      if (challenge && this.shouldLoadResults(state)) {
        dispatch(this.startWatchingResults());
        dispatch(this.watchResults(challenge));
      } else {
        // Let the calling code know there's nothing to wait for.
        return Promise.resolve();
      }
    }
  }

}

