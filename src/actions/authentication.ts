export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED';
export const AUTH_LOGIN_FAILED = 'AUTH_LOGIN_FAILED';

export function watchAuthenticated() {
  return (dispatch, getState, firebase) => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: AUTH_STATE_CHANGED, payload: user });
    });
  }
}

export function loginAction(type = "google") {
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
    // then take the successful or failed result and deal with
    // it accordingly.
    firebase.auth().signInWithPopup(provider).then((result: any) => {
      // The token for this session
      let authToken = result.credential.accessToken;

      // The user object containing information about the current user
      let user = result.user;

      dispatch({ type: AUTH_LOGIN, payload: { token: authToken, user: user } });
      dispatch(watchAuthenticated());
    }).catch(error => {
      // let errorCode = error.code;
      // let errorMessage = error.message;
      // let email = error.email;
      // let credential = error.credential;

      dispatch({ type: AUTH_LOGIN_FAILED, payload: error, error: error.message });
    });
  }
}

export function logoutAction() {
  return (dispatch, getState, firebase) => {
    firebase.auth().signOut().then(() => {
      dispatch({ type: AUTH_LOGOUT });
    }).catch(error => {
      throw new Error(error.message);
    });
  }
}