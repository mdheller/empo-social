import React from 'react';
import HomeController from './controllers/HomeController';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from 'react-redux';
import {
    setLoggedIn
} from './reducers/appReducer'

import './assets/scss/style.scss';
import AccountController from './controllers/AccountController'
import SearchController from './controllers/SearchController'
import SettingController from './controllers/SettingController'
import AdsStartController from './controllers/AdsStartController'
import AdsController from './controllers/AdsController'

const routes = [
    {
        path: '/ads',
        exact: false,
        main: ({ location, match }) => <AdsController location={location} />
    },
    {
        path: '/ads-start',
        exact: false,
        main: ({ location, match }) => <AdsStartController location={location} />
    },
    {
        path: '/setting',
        exact: false,
        main: ({ location, match }) => <SettingController location={location} />
    },
    {
        path: '/search/:key?',
        exact: false,
        main: ({ location, match }) => <SearchController location={location} match={match} />
    },
    {
        path: '/account',
        exact: false,
        main: ({ location, match }) => <AccountController location={location} />
    },
    {
        path: '/',
        exact: true,
        main: () => <HomeController />
    }
];

class App extends React.Component {
    async loginCallback(user) {
        if (user) {
            this.props.setLoggedIn(true);
        } else {
            this.props.setLoggedIn(false);
        }
    }

    render() {
        return <Router>
            {routes.map((route, index) => {
                return <Route key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main} />
            })}
        </Router>
    }
}


export default connect(state => ({
}), ({
    setLoggedIn
}))(App)
