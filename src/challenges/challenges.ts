import { inject, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { reduxStore } from '../store';
import { getStats, getCurrentChallenge, getChallenges } from '../reducers/selectors';
import { ChallengeActions } from '../actions/challenges'
import { Types } from '../types'

@inject(reduxStore, EventAggregator, ChallengeActions)
export class Challenges {
  unsubscribe: any = null;
  isLoading: boolean = false;
  challenges: Array<any> = [];

  constructor(private store: any, private ea: EventAggregator, private actions: ChallengeActions) {
    // subscribe to data changes
    this.unsubscribe = this.store.subscribe(() => {
      this.update();
    });
    this.update();
  }

  /**
   * Load data on activation of the view.
   *
   * @param params (description)
   * @param routeConfig (description)
   */
  activate(params, routeConfig) {
    this.store.dispatch(this.actions.loadChallenges());
  }

  /**
   * Unsubscribe from state changes.
   */
  deactivate() {
    this.unsubscribe();
    this.store.dispatch(this.actions.stopWatchingChallenges());
  }

  /**
   * Update ViewModel (VM) properties when the state changes.
   */
  update() {
    const state = this.store.getState();

    this.challenges = getChallenges(state);
  }
}
