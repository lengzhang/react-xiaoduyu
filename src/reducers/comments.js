import merge from 'lodash/merge';

let initialState = {}

export default function user(state = initialState, action = {}) {

    switch (action.type) {

        case 'SET_COMMENTS_LIST':
            let { name, data } = action;
            state[name] = data;
            return merge({}, state, {});

        default:
            return state;
    }

}

export const getCommentsList = (state, name) => {
    return state.comments[name] ? state.comments[name] : {};
}
