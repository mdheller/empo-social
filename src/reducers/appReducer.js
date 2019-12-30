import {createReducer,createAction} from 'redux-starter-kit';

export const setMyAddress = createAction('setMyAddress');
export const setMyAccountInfo = createAction('setMyAccountInfo');

export const appReducer = createReducer({
    myAddress: false,
    myAccountInfo: {}
}, {
    [setMyAddress]: (state, {payload}) => {
        state.myAddress = payload;
    },
    [setMyAccountInfo]: (state, {payload}) => {
        state.myAccountInfo = payload;
    }
});