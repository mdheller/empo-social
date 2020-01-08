import {createReducer,createAction} from 'redux-starter-kit';

export const setMyAddress = createAction('setMyAddress');
export const setMyAccountInfo = createAction('setMyAccountInfo');
export const setTypeNewFeed = createAction('setTypeNewFeed');

export const appReducer = createReducer({
    myAddress: false,
    myAccountInfo: false,
    typeNewFeed: 'trending'
}, {
    [setMyAddress]: (state, {payload}) => {
        state.myAddress = payload;
    },
    [setMyAccountInfo]: (state, {payload}) => {
        state.myAccountInfo = payload;
    },
    [setTypeNewFeed]: (state, {payload}) => {
        state.typeNewFeed = payload;
    },
});