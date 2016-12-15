export const USERS_LOAD = 'USERS_LOAD';

export function loadUsers(users) {
  return { type: USERS_LOAD, payload: users };
}
