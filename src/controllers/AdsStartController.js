import React, { Component } from 'react'

import Photos from '../assets/images/Group 7443.svg'
import HeaderAds from '../components/HeaderAds';

class AdsStartController extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    };

    render() {
        var { index, key } = this.state
        return (
            <div>
                <HeaderAds></HeaderAds>
                <div id="ads-start" className="container wrapper">
                    <div className="left">
                        <p style={{fontSize: '64px', letterSpacing: '0.9px', lineHeight: '0.97'}}>DIGITAL MARKETING</p>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. </p>
                        <button className="btn-general-2">START</button>
                    </div>
                    <div className="right">
                        <img src={Photos} alt="photos"></img>
                    </div>
                </div>
            </div>
        )


    }
}

export default AdsStartController