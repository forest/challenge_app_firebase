import { CHALLENGES_CURRENT_CHANGED } from '../actions/challenges'
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_STATE_CHANGED } from '../actions/authentication'

export interface IAppState {
  currentUser: any;
  currentChallenge: any;
}

const initialState: IAppState = {
  currentUser: null,
  currentChallenge: null
};

export function appState(state: IAppState = initialState, action): IAppState {
  switch (action.type) {
    case AUTH_LOGIN:
      return Object.assign({}, state, {
        currentUser: action.payload.user
      });

    case AUTH_LOGOUT:
      return Object.assign({}, state, {
        currentUser: null
      });

    case AUTH_STATE_CHANGED:
      return Object.assign({}, state, {
        currentUser: action.payload
      });

    case CHALLENGES_CURRENT_CHANGED:
      return Object.assign({}, state, {
        currentChallenge: action.payload
      });

    default:
      return state;
  }
}
