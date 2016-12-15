import {
  RESULTS_WATCHING_ON,
  RESULTS_WATCHING_OFF,
  RESULTS_UPDATE
} from '../actions/results';
import { AUTH_LOGOUT } from '../actions/authentication';

export interface IResultsState {
  watching: boolean;
  data: {};
}

const initialState: IResultsState = {
  watching: false,
  data: {}
};

export function results(state: IResultsState = initialState, action): IResultsState {
  switch (action.type) {
    case RESULTS_WATCHING_ON:
      return Object.assign({}, state, {
        watching: true
      });

    case RESULTS_WATCHING_OFF:
      return Object.assign({}, state, {
        watching: false
      });

    case RESULTS_UPDATE:
      let challengeResults = {};
      challengeResults[action.payload.challenge.key] = action.payload.results;

      return Object.assign({}, state, {
        data: challengeResults
      });

    case AUTH_LOGOUT:
      return Object.assign({}, state, initialState);

    default:
      return state;
  }
}
