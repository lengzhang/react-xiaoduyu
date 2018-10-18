
import { combineReducers } from 'redux';
import merge from 'lodash/merge';

import captcha from './captcha';
import comments from './comments';
import countries from './countries';
import posts from './posts';
import user from './user';

let states = {
    captcha,
    comments,
    countries,
    posts,
    user,
}

// 创建一个无数据的states，用于在服务端初始redux数据
let _states = {};
for (let i in states) {
  _states[i] = merge({}, states[i](), {})
}
_states = JSON.stringify(_states);
export const initialStateJSON = _states;

// reducer
export default combineReducers(states);
