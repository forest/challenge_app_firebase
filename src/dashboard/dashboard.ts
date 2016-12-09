import { inject, computedFrom } from 'aurelia-framework';
import { reduxStore } from '../store';
import { getChallenges } from '../reducers/selectors'

@inject(reduxStore)
export class Dashboard {
  unsubscribe: any = null;
  isLoading: boolean = false;

  constructor(private store: any) {
    // subscribe to data changes
    // this.unsubscribe = this.store.subscribe(() => {
    //   this.update();
    // });
    // this.update();
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
  }
}