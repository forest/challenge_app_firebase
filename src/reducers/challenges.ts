import { CHALLENGES_CURRENT_CHANGED } from '../actions/challenges'
import * as R from 'ramda';

export interface IChallengesState {
  watching: boolean;
  items: Array<any> | null;
}

const initialState: IChallengesState = {
  watching: false,
  items: null
};

export function challenges(state: IChallengesState = initialState, action): IChallengesState {
  let payload = {
    "1": {
      "key": "1",
      "name": "Push-up Challenge",
      "people": {
        "mark": true,
        "jeremy": true,
        "forest": true
      },
    },
    "2": {
      "key": "2",
      "name": "Wall Sit Challenge",
      "people": {
        "mark": true,
        "jeremy": true,
        "forest": true
      }
    }
  };

  return Object.assign({}, state, {
    items: R.values(payload)
  });
}

export function currentChallenge(state: any = null, action): any {
  switch (action.type) {
    case CHALLENGES_CURRENT_CHANGED:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
