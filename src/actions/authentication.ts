import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as R from 'ramda';
import { Types } from '../types'
import { ChallengeActions } from './challenges'
import { ResultActions } from './results'
import { getCurrentUser, getCurrentChallenge } from '../reducers/selectors'

export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED';
export const AUTH_LOGIN_FAILED = 'AUTH_LOGIN_FAILED';

/**
 * AuthenticationActions
 */
@inject(EventAggregator, ChallengeActions, ResultActions)
export class AuthenticationActions {
  constructor(
    private ea: EventAggregator,
    private challengeActions: ChallengeActions,
    private resultActions: ResultActions) { }

  watchAuthenticated() {
    return (dispatch, getState, firebase) => {
      // watch for auth state changes
      firebase.auth().onAuthStateChanged(user => {
        dispatch({ type: AUTH_STATE_CHANGED, payload: user });
        dispatch(this.challengeActions.loadChallenges(user));
      });

      // watch for redirects back after login
      firebase.auth().getRedirectResult().then(result => {
        let user = result.user;
        if (user) {
          // let credential = result.credential;
          dispatch({ type: AUTH_LOGIN, payload: user });
          dispatch(this.saveUser(user));
        }
      }).catch(error => {
        // let errorCode = error.code;
        // let errorMessage = error.message;
        // let email = error.email;
        // let credential = error.credential;

        dispatch({ type: AUTH_LOGIN_FAILED, payload: error, error: error.message });
      });;
    }
  }

  loginAction(type = "google") {
    return (dispatch, getState, firebase) => {
      let provider;

      // Determine which provider to use depending on provided type
      if (type === 'google') {
        provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      } else if (type === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider();
      } else if (type === 'twitter') {
        provider = new firebase.auth.TwitterAuthProvider();
      }

      // Call the Firebase signin method for our provider
      firebase.auth().signInWithRedirect(provider);
    }
  }

  logoutAction() {
    return (dispatch, getState, firebase) => {
      const state = getState();

      firebase.auth().signOut().then(() => {
        dispatch(this.resultActions.stopWatchingResults(getCurrentChallenge(state)));
        dispatch(this.challengeActions.stopWatchingChallenges(getCurrentUser(state)));
        dispatch({ type: AUTH_LOGOUT });
      }).catch(error => {
        throw new Error(error.message);
      });
    }
  }

  private saveUser(user: Types.IAuthenticatedUser) {
    return (dispatch, getState, firebase) => {
      let updates = {};
      updates[`users/${user.uid}/email`] = R.prop('email', R.head(user.providerData));
      updates[`users/${user.uid}/name`] = user.displayName;
      updates[`users/${user.uid}/photoURL`] = user.photoURL;
      updates[`user_names/${user.uid}`] = user.displayName;

      firebase.database().ref().update(updates).catch(error => {
        // TODO: figure out good way to do error handling
        console.log(error.message);
        throw new Error(error.message);
      });
    }
  }
}
