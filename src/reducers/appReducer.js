import {createReducer,createAction} from 'redux-starter-kit';

export const setMyAddress = createAction('setMyAddress');
export const setMyAccountInfo = createAction('setMyAccountInfo');
export const setListFollow = createAction('setListFollow');
export const setListPostLiked = createAction('setListPostLiked');

export const appReducer = createReducer({
    myAddress: false,
    myAccountInfo: false,
    listFollow: false,
    listPostLiked: false
}, {
    [setMyAddress]: (state, {payload}) => {
        state.myAddress = payload;
    },
    [setMyAccountInfo]: (state, {payload}) => {
        state.myAccountInfo = payload;
    },
    [setListFollow]: (state, {payload}) => {
        state.listFollow = payload;
    },
    [setListPostLiked]: (state, {payload}) => {
        state.listPostLiked = payload;
    }
});