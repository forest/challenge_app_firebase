import { CHALLENGES_CURRENT_CHANGED } from '../actions/challenges'

export function currentChallenge(state: any = null, action): any {
  switch (action.type) {
    case CHALLENGES_CURRENT_CHANGED:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
