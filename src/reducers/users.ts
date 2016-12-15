import { USERS_LOAD } from '../actions/users';
import * as R from 'ramda';

export interface IUsersState {
  data: {};
}

const initialState: IUsersState = {
  data: {}
};

export function users(state: IUsersState = initialState, action): IUsersState {
  switch (action.type) {
    case USERS_LOAD:
      let allUsers = R.merge(state.data, action.payload);

      return Object.assign({}, state, {
        data: allUsers
      });

    default:
      return state;
  }
}
