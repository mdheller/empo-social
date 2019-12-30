import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import reducer from './reducers/index'


var store = configureStore({
    middleware: [
        ...getDefaultMiddleware(),
        // reduxLogger
    ],
    reducer
});

ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
