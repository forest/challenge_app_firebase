import * as R from 'ramda';
import {
  CHALLENGES_WATCHING_ON,
  CHALLENGES_WATCHING_OFF,
  CHALLENGES_UPDATE
} from '../actions/challenges';
import { AUTH_LOGOUT } from '../actions/authentication';

export interface IChallengesState {
  watching: boolean;
  data: Array<any>;
}

const initialState: IChallengesState = {
  watching: false,
  data: []
};

export function challenges(state: IChallengesState = initialState, action): IChallengesState {
  switch (action.type) {
    case CHALLENGES_WATCHING_ON:
      return Object.assign({}, state, {
        watching: true
      });

    case CHALLENGES_WATCHING_OFF:
      return Object.assign({}, state, {
        watching: false
      });

    case CHALLENGES_UPDATE:
      return Object.assign({}, state, {
        data: R.values(action.payload)
      });

    case AUTH_LOGOUT:
      return Object.assign({}, state, initialState);

    default:
      return state;
  }
}
