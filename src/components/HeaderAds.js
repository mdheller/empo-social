import React, { Component } from 'react'
import Logo from '../assets/images/Group 561.svg'
import IconAva from '../assets/images/avatar.svg'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from './Button';
import List from '../assets/images/list.svg';
import Mess from '../assets/images/message-circle.svg'
import Noti from '../assets/images/notifications-button.svg'
import Setting from '../assets/images/XMLID_22_.svg'
import Search from '../assets/images/Search.svg'

class HeaderAds extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    };


    render() {
        return (
            <div className="header">
                <div className="container">
                    <Link className="waper-logo" to="/">
                        <img src={Logo} alt="photos"></img>
                        <p style={{ color: 'white' }}>EmAds</p>
                    </Link>
                    <div className="waper-account">
                        <a href="/account"><img src={IconAva} alt="photos"></img></a>
                        <div className="waper-icon">
                            <a href="/setting"><img src={Setting} alt="photos"></img></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(state => ({
    // loggedIn: state.app.loggedIn,
}), ({
}))(HeaderAds)