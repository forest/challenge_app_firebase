import {bindable, customElement, inject, computedFrom} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { reduxStore } from './store';
import { getCurrentChallenge, getChallenges } from './reducers/selectors'
import { loadChallenges, stopWatchingChallenges, changeCurrentChallenge } from './actions/challenges'

@customElement('nav-bar')
@inject(reduxStore)
export class NavBar {
  @bindable router: Router;

  unsubscribe: any = null;
  isLoading: boolean = false;
  challenges: any = [];
  currentChallenge: any = null;

  constructor(private store: any) {
    // subscribe to data changes
    this.unsubscribe = this.store.subscribe(() => {
      this.update();
    });
    this.update();
    this.store.dispatch(changeCurrentChallenge(this.challenges[0]));
  }

  /**
   * Load data on activation of the view.
   *
   * @param params (description)
   * @param routeConfig (description)
   */
  activate(params, routeConfig) {
    this.store.dispatch(loadChallenges());
  }

  /**
   * Unsubscribe from state changes.
   */
  deactivate() {
    this.unsubscribe();
    this.store.dispatch(stopWatchingChallenges());
  }

  /**
   * Update ViewModel (VM) properties when the state changes.
   */
  update() {
    const state = this.store.getState();

    this.challenges = getChallenges(state);
    this.currentChallenge = getCurrentChallenge(state);
  }

  /**
   * Click handler for the
   *
   * @param {any} challenge
   *
   * @memberOf App
   */
  changeCurrentChallenge(challenge) {
    this.store.dispatch(changeCurrentChallenge(challenge));
  }
}