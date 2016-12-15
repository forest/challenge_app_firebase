import { inject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { reduxStore } from '../store';
import { getStats, getTodaysStats, getCurrentChallenge, getCurrentUser } from '../reducers/selectors';
import { ResultActions } from '../actions/results'
import { CHALLENGES_CURRENT_CHANGED } from '../actions/challenges'
import { trackIncrement, trackDecrement } from '../actions/track';
import { Types } from '../types'

@inject(reduxStore, EventAggregator, ResultActions)
export class Dashboard {
  unsubscribe: any = null;
  isLoading: boolean = false;
  todaysStats: any = [];
  currentChallenge: any = null;
  currentUser: any = null;

  constructor(private store: any, private ea: EventAggregator, private resultActions: ResultActions) {
    // subscribe to data changes
    this.unsubscribe = this.store.subscribe(() => {
      this.update();
    });
    this.update();

    this.ea.subscribe(CHALLENGES_CURRENT_CHANGED, challenge => {
      this.updateResultsSubscription(challenge);
    });
  }

  /**
   * Load data on activation of the view.
   *
   * @param params (description)
   * @param routeConfig (description)
   */
  activate(params, routeConfig) {
    this.store.dispatch(this.resultActions.loadResults(this.currentChallenge));
  }

  /**
   * Unsubscribe from state changes.
   */
  deactivate() {
    this.unsubscribe();
    this.store.dispatch(this.resultActions.stopWatchingResults(this.currentChallenge));
  }

  /**
   * Update ViewModel (VM) properties when the state changes.
   */
  update() {
    const state = this.store.getState();

    this.currentUser = getCurrentUser(state);
    this.currentChallenge = getCurrentChallenge(state);
    this.todaysStats = getTodaysStats(state);
  }

  /**
   * Update subscription to results for a given challenge
   * when the current challenge is changed.
   *
   * @param {Types.IChallenge} challenge
   *
   * @memberOf Dashboard
   */
  updateResultsSubscription(challenge: Types.IChallenge) {
    this.store.dispatch(this.resultActions.stopWatchingResults(challenge));
    this.store.dispatch(this.resultActions.loadResults(challenge));
  }

 increment() {
    this.store.dispatch(trackIncrement(this.currentUser, this.currentChallenge));
  }

  decrement() {
    this.store.dispatch(trackDecrement(this.currentUser, this.currentChallenge));
  }
}