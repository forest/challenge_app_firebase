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
    "one": {
      "key": "one",
      "name": "Push-up Challenge",
      "started": "2016-12-08T17:01:50.468Z",
      "finished": null,
      "members": {
        "mark": true,
        "jeremy": true,
        "forest": true
      },
      "winner": null
    },
    "two": {
      "key": "two",
      "name": "Wall Sit Challenge",
      "started": null,
      "finished": null,
      "members": {
        "mark": true,
        "jeremy": true,
        "forest": true
      },
      "winner": null
    }
  };

  return Object.assign({}, state, {
    items: R.values(payload)
  });
}
