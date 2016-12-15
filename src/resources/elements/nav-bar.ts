import { bindable, customElement, inject, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { reduxStore } from '../../store';
import { getCurrentUser, isUserLoggedIn, getCurrentChallenge, getChallenges } from '../../reducers/selectors'
import { ChallengeActions } from '../../actions/challenges'
import { AuthenticationActions } from '../../actions/authentication'

@customElement('nav-bar')
@inject(reduxStore, ChallengeActions, AuthenticationActions)
export class NavBar {
  @bindable router: Router;

  unsubscribe: any = null;
  isLoading: boolean = false;
  challenges: any = [];
  currentChallenge: any = null;
  isLoggedIn: boolean = false;
  currentUser: any = null;

  constructor(
    private store: any,
    private challengeActions: ChallengeActions,
    private authActions: AuthenticationActions) {
    // subscribe to data changes
    this.unsubscribe = this.store.subscribe(() => {
      this.update();
    });
    this.update();
  }

  /**
   * Load data when element is attached to the DOM.
   */
  attached() {
  }

  /**
   * Unsubscribe from state changes.
   */
  detached() {
    this.unsubscribe();
  }

  /**
   * Update ViewModel (VM) properties when the state changes.
   */
  update() {
    const state = this.store.getState();

    this.currentUser = getCurrentUser(state);
    this.isLoggedIn = isUserLoggedIn(state);
    this.challenges = getChallenges(state);
    this.currentChallenge = getCurrentChallenge(state);
  }

  login() {
    this.store.dispatch(this.authActions.loginAction());
  }

  logout() {
    this.store.dispatch(this.authActions.logoutAction());
  }

  /**
   * Click handler for the
   *
   * @param {any} challenge
   *
   * @memberOf App
   */
  changeCurrentChallenge(challenge) {
    this.store.dispatch(this.challengeActions.changeCurrentChallenge(challenge));
  }
}