import merge from 'lodash/merge';

let initialState = {}

export default function user(state = initialState, action = {}) {

  switch (action.type) {

    case 'SAVE_ACCESS_TOKEN':
      return merge({}, state, {});

    default:
      return state;
  }

}
