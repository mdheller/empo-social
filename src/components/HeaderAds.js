import React, { Component } from 'react'
import Logo from '../assets/images/Group 561.svg'
import IconAva from '../assets/images/avatar.svg'
import { Link } from 'react-router-dom';
import Setting from '../assets/images/XMLID_22_.svg'

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

export default HeaderAds