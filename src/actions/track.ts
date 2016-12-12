export const TRACK_INCREMENT = 'TRACK_INCREMENT';
export const TRACK_DECREMENT = 'TRACK_DECREMENT';

export function trackIncrement(user, challenge) {
  return { type: TRACK_INCREMENT, payload: {"user": user, "challenge": challenge} };
}

export function trackDecrement(user, challenge) {
  return { type: TRACK_DECREMENT, payload: {"user": user, "challenge": challenge} };
}
