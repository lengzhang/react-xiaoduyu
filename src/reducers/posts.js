import merge from 'lodash/merge';

let initialState = {}

export default function user(state = initialState, action = {}) {

    switch (action.type) {

        case 'SET_POSTS_LIST':
            let { name, data } = action;
            state[name] = data;
            return merge({}, state, {});

        default:
            return state;
    }

}

export const getPostsList = (state, name) => {
    return state.posts[name] ? state.posts[name] : {};
}
