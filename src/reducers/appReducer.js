import {createReducer,createAction} from 'redux-starter-kit';

export const setLoggedIn = createAction('setLoggedIn');

export const appReducer = createReducer({
    loggedIn: false
}, {
    [setLoggedIn]: (state, {payload}) => {
        state.loggedIn = payload;
    }
});