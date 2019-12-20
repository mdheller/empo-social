import React from 'react'
import copyright from '../assets/images/copyright.svg'
import LogoTelegram from '../assets/images/logo-telegram.svg'
import LogoTwitter from '../assets/images/logo-twitter.svg'
import LogoFacebook from '../assets/images/logo-facebook.svg'

const Fooder = props => {
    return (
        <div className="fooder">
            <div className="container">
                <div className="waper">
                    <div className="group">
                        <h1>Company</h1>
                        <a href="https://empow.io" target="_blank" rel="noopener noreferrer">About us</a>
                        <a href="https://t.me/empowofficial" target="_blank" rel="noopener noreferrer">Contact us</a>
                        <p>Advertise</p>
                        <p>Brand Assets</p>
                        <a href="https://empow.io/termsofservice" target="_blank" rel="noopener noreferrer">Term of Service</a>
                    </div>
                    <div className="group">
                        <h1>EMPOW Ecosystem</h1>
                        <a href="https://empow.io" target="_blank" rel="noopener noreferrer">Empow.io</a>
                        <a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" target="_blank" rel="noopener noreferrer">Empow Wallet</a>
                    </div>
                    <div className="group">
                        <h1>Follow Us</h1>
                        <a href="https://t.me/empowofficial" target="_blank" rel="noopener noreferrer" className="logo">
                            <img alt="photos" src={LogoTelegram}></img>
                            <p>Telegram</p>
                        </a>
                        <a href="https://twitter.com/Empowofficial" target="_blank" rel="noopener noreferrer" className="logo">
                            <img alt="photos" src={LogoTwitter}></img>
                            <p>Twitter</p>
                        </a>
                        <a href="https://www.facebook.com/Empowofficial/" target="_blank" rel="noopener noreferrer" className="logo">
                            <img alt="photos" src={LogoFacebook}></img>
                            <p>Facebook</p>
                        </a>
                    </div>
                </div>
                <span>Copyright <img alt="photos" src={copyright}></img>2019 emscan.org</span>
            </div>
        </div>
    );
};

export default Fooder;