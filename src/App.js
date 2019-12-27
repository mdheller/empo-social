import React, { Fragment } from 'react';
import HomeController from './controllers/HomeController';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './assets/scss/style.scss';
import AccountController from './controllers/AccountController'
import SearchController from './controllers/SearchController'
import SettingController from './controllers/SettingController'
import AdsStartController from './controllers/AdsStartController'
import AdsController from './controllers/AdsController'
import PostDetailController from './controllers/PostDetailController'
import MyAccountController from './controllers/MyAccountController'

const routes = [
    {
        path: '/my-account',
        exact: false,
        main: ({ location, match }) => <MyAccountController location={location} match={match} />
    },
    {
        path: '/post-detail/:postId?',
        exact: false,
        main: ({ location, match }) => <PostDetailController location={location} match={match} />
    },
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
        path: '/account/:address?',
        exact: false,
        main: ({ location, match }) => <AccountController location={location} match={match} />
    },
    {
        path: '/',
        exact: true,
        main: () => <HomeController />
    }
];

class App extends React.Component {
    render() {
        return (
            <Fragment>
                <Router>
                    {routes.map((route, index) => {
                        return <Route key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.main} />
                    })}
                </Router>
                {/* <Alert timeout={5000} stack={{limit: 3}} /> */}
            </Fragment>
        )
    }
}


export default App
