import { inject, computedFrom } from 'aurelia-framework';
import { reduxStore } from '../store';
import { trackIncrement, trackDecrement } from '../actions/track';
import { getCurrentChallenge } from '../reducers/selectors';

@inject(reduxStore)
export class Track {
  unsubscribe: any = null;
  currentChallenge: any = null;

  constructor(private store: any) {
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
    // this.store.dispatch(loadChallenges());
  }

  /**
   * Unsubscribe from state changes.
   */
  deactivate() {
    this.unsubscribe();
    // this.store.dispatch(stopWatchingChallenges());
  }

  /**
   * Update ViewModel (VM) properties when the state changes.
   */
  update() {
    const state = this.store.getState();

    this.currentChallenge = getCurrentChallenge(state);
  }

  increment() {
    this.store.dispatch(trackIncrement('forest', this.currentChallenge));
  }

  decrement() {
    this.store.dispatch(trackDecrement('forest', this.currentChallenge));
  }

}