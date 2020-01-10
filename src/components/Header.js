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
import { connect } from 'react-redux';
import {
    setMyAddress,
    setMyAccountInfo,
    setTypeNewFeed
} from '../reducers/appReducer'

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { SOCKET } from '../constants/index'
const socket = io(SOCKET);

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            textSearch: '',
            listNoti: [],
            showNoti: false,
            newNoti: [],
            myAccountInfo: {}
        }
    };

    async componentDidMount() {

        if (!window || !window.empow || !window.empow.enable) {
            return;
        }

        var myAddress = await window.empow.enable()
        var myAccountInfo = await ServerAPI.getAddress(myAddress)

        this.props.setMyAddress(myAddress);
        this.props.setMyAccountInfo(myAccountInfo);

        this.setState({
            myAddress,
            myAccountInfo
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

    onClickNoti = (noti) => {
        window.location = '/post-detail/' + noti.postId
    }

    onChangeTypeNewFeed = (type) => {
        this.props.setTypeNewFeed(type);
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
                        <li onClick={() => this.onClickNoti(value)} style={{ cursor: 'pointer' }}>
                            <p>{value.target} đã {value.action} bài viết của bạn</p>
                        </li>
                    )
                })}
            </ul>
        )
    }

    render() {
        var { myAccountInfo, myAddress } = this.state
        var { typeNewFeed } = this.props
        var profile = myAccountInfo.profile || {}

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
                        <li onClick={() => this.onChangeTypeNewFeed('trending')} style={typeNewFeed === 'trending' ? { color: '#ff6a7e' } : {}}>Trending</li>
                        <li onClick={() => this.onChangeTypeNewFeed('follow')} style={typeNewFeed === 'follow' ? { color: '#ff6a7e' } : {}}>Follow</li>
                        <li onClick={() => this.onChangeTypeNewFeed('all')} style={typeNewFeed === 'all' ? { color: '#ff6a7e' } : {}}>Newest</li>
                    </ul>
                    {myAddress && <div className="waper-account">
                        <a href="/my-account"><img src={profile.avatar ? profile.avatar : IconAva} alt="photos" className="waper-ava"></img></a>
                        <div className="waper-icon">
                            <img src={Mess} alt="photos"></img>
                            <img src={Noti} alt="photos" onClick={() => this.onShowNoti()}></img>
                            <a href="/setting"><img src={Setting} alt="photos"></img></a>
                        </div>
                    </div>}

                    {!myAddress && <div className="waper-account">
                        <a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" target="_blank" rel="noopener noreferrer">Install Empow Wallet</a>
                    </div>}

                    {this.state.showNoti && this.renderNoti()}
                </div>
            </div>
        );
    }
};


export default connect(state => ({
    typeNewFeed: state.app.typeNewFeed
}), ({
    setMyAddress,
    setMyAccountInfo,
    setTypeNewFeed
}))(Header)