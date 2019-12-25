import React, { Component } from 'react'
import Logo from '../assets/images/Group 561.svg'
import IconAva from '../assets/images/avatar.svg'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Mess from '../assets/images/message-circle.svg'
import Noti from '../assets/images/notifications-button.svg'
import Setting from '../assets/images/XMLID_22_.svg'
import Search from '../assets/images/Search.svg'

import io from 'socket.io-client';
const socket = io('http://localhost:8000');

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            textSearch: '',
            listNoti: []
        }
    };

    async componentDidMount() {
        var myAddress = await window.empow.enable()

        socket.emit("get_new_like", myAddress)
        socket.on("res_new_like", (data) => {
            this.convertNoti(data)
        });

        socket.emit("get_new_comment", myAddress)
        socket.on("res_new_comment", (data) => {
            this.convertNoti(data)
        });
    }

    convertNoti = (data) => {
        var obj = {
            target: data.target,
            action: data.action,
            text: `${data.target} đã ${data.action} bài viết của bạn`
        }

        var listNoti = this.state.listNoti;
        listNoti.push(obj)

        this.setState({
            listNoti
        })
    }

    onSearch = () => {
        const { textSearch } = this.state
        window.location = '/search/' + textSearch
    }

    handleKeyDownSearch = (e) => {
        const { textSearch } = this.state
        if (e.key === 'Enter') {
            window.location = '/search/' + textSearch
        }
    }

    render() {
        return (
            <div className="header">
                <div className="container">
                    <Link className="waper-logo" to="/">
                        <img src={Logo} alt="photos"></img>
                        <p style={{ color: 'white' }}>Empo</p>
                    </Link>
                    <div className="search">
                        <div className="waper-search" onClick={this.onSearch}>
                            <img src={Search} alt="photos"></img>
                        </div>
                        <input onChange={(e) => this.setState({ textSearch: e.target.value })}
                            onKeyDown={this.handleKeyDownSearch}></input>
                    </div>
                    <ul className="menu">
                        <li><a href="/trending">Trending</a></li>
                        <li><a href="/follow">Follow</a></li>
                    </ul>
                    {window.empow && <div className="waper-account">
                        <a href="/account"><img src={IconAva} alt="photos"></img></a>
                        <div className="waper-icon">
                            <img src={Mess} alt="photos"></img>
                            <img src={Noti} alt="photos"></img>
                            <a href="/setting"><img src={Setting} alt="photos"></img></a>
                        </div>
                    </div>}

                    {!window.empow && <div className="waper-account">
                        <a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" target="_blank" rel="noopener noreferrer">Install Empow Wallet</a>
                    </div>}
                </div>
            </div>
        );
    }
};

export default connect(state => ({
    // loggedIn: state.app.loggedIn,
}), ({
}))(Header)