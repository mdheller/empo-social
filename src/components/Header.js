import React, { Component } from 'react'
import Logo from '../assets/images/Group 561.svg'
import IconAva from '../assets/images/avatar.svg'
import { Link } from 'react-router-dom';
import Mess from '../assets/images/message-circle.svg'
import Noti from '../assets/images/notifications-button.svg'
import Setting from '../assets/images/XMLID_22_.svg'
import Search from '../assets/images/Search.svg'

import io from 'socket.io-client';
import ServerAPI from '../ServerAPI';
//import Alert from '../components/Alert'

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

const socket = io('http://localhost:8000');

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            textSearch: '',
            listNoti: [],
            showNoti: false,
            newNoti: []
        }
    };

    async componentDidMount() {

        var myAddress = await window.empow.enable()

        this.setState({
            myAddress
        })
        socket.emit("get_new_like", myAddress)
        socket.on("res_new_like", (data) => {
            this.convertNoti(data)
        });

        socket.emit("get_new_comment", myAddress)
        socket.on("res_new_comment", (data) => {
            this.convertNoti(data)
        });
    }

    getNoti = async () => {
        var listNoti = await ServerAPI.getNotification(this.state.myAddress);
        this.setState({
            listNoti
        })
    }

    convertNoti = (data) => {
        Alert.info(`<a href="/post-detail/${data.postId}">${data.target} đã ${data.action} bài viết của bạn</a>`, {
            position: 'bottom-left',
            effect: 'slide',
        });
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

    onShowNoti = async () => {
        if (!this.state.showNoti) {
            await this.getNoti();
        }

        this.setState({
            showNoti: !this.state.showNoti
        })
    }

    onClickNoti = async (noti) => {
        window.location = '/post-detail/' + noti.postId
    }

    renderNoti() {
        var { listNoti } = this.state

        if (listNoti.length === 0) {
            return (
                <ul className="waper-noti scroll">
                    <p>Không có thông báo</p>
                </ul>
            )
        }
        return (
            <ul className="waper-noti scroll">
                {listNoti.map((value, index) => {
                    return (
                        <li onClick={() => this.onClickNoti(value)}>
                            <p>{value.target} đã {value.action} bài viết của bạn</p>
                        </li>
                    )
                })}
            </ul>
        )
    }

    render() {
        return (
            <div className="header">
                <Alert stack={{ limit: 3 }} timeout={5000} html={true}></Alert>
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
                            <img src={Noti} alt="photos" onClick={() => this.onShowNoti()}></img>
                            <a href="/setting"><img src={Setting} alt="photos"></img></a>
                        </div>
                    </div>}

                    {!window.empow && <div className="waper-account">
                        <a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" target="_blank" rel="noopener noreferrer">Install Empow Wallet</a>
                    </div>}

                    {this.state.showNoti && this.renderNoti()}
                </div>
            </div>
        );
    }
};

export default Header