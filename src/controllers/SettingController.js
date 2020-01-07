import React, { Component } from 'react'
import Headers from '../components/Header';

import Navbar from '../components/Navbar';
import Facebook from '../assets/images/facebook.svg'
import Twitt from '../assets/images/twitt.svg'
import IconAva from '../assets/images/avatar.svg'
import Select from 'react-select'
import { connect } from 'react-redux';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import _ from 'lodash'

class SettingController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 'username',
            blockList: [
                {
                    ava: IconAva,
                    name: 'ABCSADS',
                    mess: 'alo! Hello'
                },
                {
                    ava: IconAva,
                    name: 'ABCSADS',
                    mess: 'alo! Hello'
                },
                {
                    ava: IconAva,
                    name: 'ABCSADS',
                    mess: 'alo! Hello'
                }
            ],
            language: [
                { label: 'English', value: 1 },
                { label: 'Viet Nam', value: 2 },
                { label: 'Han Quoc', value: 3 }
            ],
            defaultValue: { label: 'English', value: 1 },
            option: 0,
            usernameText: '',
            selectUsername: '',
            username: []
        };
    };

    componentDidUpdate(pre) {
        if(_.isEqual(pre, this.props)) {
            return;
        }

        this.setState({
            selectUsername: this.props.myAccountInfo.selected_username || '',
            username: this.props.myAccountInfo.username || []
        })
    }
    handleChangeSelect = (value) => {
        this.setState({
            defaultValue: value
        })
    }

    handleChangeUsernameText = (event) => {
        this.setState({
            usernameText: event.target.value
        });
    }

    onChangeCheckbox = (value) => {
        this.setState({
            selectUsername: value
        })
    }

    onBuyUsername = () => {
        var { option, usernameText } = this.state;
        var { myAddress } = this.props

        if (!myAddress) {
            return;
        }

        if (option === 0) {
            const tx = window.empow.callABI("auth.empow", "addNormalUsername", [myAddress, usernameText])

            this.action(tx, 'addNormal');
        }

        if (option === 1) {
            const tx = window.empow.callABI("auth.empow", "addPremiumUsername", [myAddress, usernameText])

            this.action(tx, 'addPremium');
        }
    }

    onBuySuccess = (type) => {
        var { username } = this.state
        var usernameText = ''
        if (type === 'normal') {
            usernameText = 'newbie.' + this.state.usernameText
        } else {
            usernameText = this.state.usernameText
        }

        username.push(usernameText)
        this.setState({
            username,
            usernameText: ''
        })
    }

    onSelectUsername = () => {
        var { selectUsername } = this.state;
        const tx = window.empow.callABI("auth.empow", "selectUsername", [selectUsername])
        this.action(tx);
    }

    action = (tx, actionName = false) => {
        tx.addApprove("*", "unlimited")

        const handler = window.empow.signAndSend(tx)

        // handler.on("pending", (hash) => {
        //     addAlert("warning", `transaction on pending: ${hash}`)
        // })

        handler.on("failed", (error) => {
            var msg = error.message.split("Error: ")

            Alert.error(msg[2], {
                position: 'bottom-left',
                effect: 'slide',
            });
        })

        handler.on("success", (res) => {
            console.log(res)

            if (actionName === 'addNormal') {
                this.onBuySuccess('normal')
            }

            if (actionName === 'addPremium') {
                this.onBuySuccess('premium')
            }
        })
    }


    renderUsername() {
        var { option, selectUsername, username } = this.state
        var { myAccountInfo } = this.props;
        return (
            <div className="username">
                <p className="title">Account</p>
                <ul>
                    {username.map((value, index) => {
                        return (
                            <li>
                                <p>{value}</p>
                                <label className="checkbox">
                                    <input type="radio" name="radio" checked={(value === selectUsername || value === myAccountInfo.selected_username) ? true : false} onChange={() => this.onChangeCheckbox(value)} />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                        )
                    })}
                </ul>
                <div className="waper-button">
                    <button className="btn-general-2" onClick={() => this.onSelectUsername()}>Save</button>
                </div>

                <div className="waper-option">
                    <button onClick={() => this.setState({ option: 0 })}
                        className={option === 0 ? "active" : ""}>Free</button>
                    <button onClick={() => this.setState({ option: 1 })}
                        className={option === 1 ? "active" : ""}>10 USD</button>
                </div>

                <div className="waper-input">
                    <p>Username</p>
                    {option === 0 && <div style={{ display: 'flex' }}>
                        <span style={{ fontSize: '14px' }}>newbie.</span>
                        <input value={this.state.usernameText}
                            onChange={this.handleChangeUsernameText}></input>
                    </div>}
                    {option === 1 &&
                        <input value={this.state.usernameText}
                            onChange={this.handleChangeUsernameText}></input>
                    }
                </div>

                <div className="waper-button">
                    <button className="btn-general-2" onClick={() => this.onBuyUsername()}>Buy</button>
                </div>

                {/* <p style={{ color: 'red', marginLeft: '20px' }}>*Tài khoản này đã được mua, vui lòng chọn tài khoản khác</p> */}
            </div>

        )
    }

    renderBlockList() {
        var { blockList } = this.state
        return (
            <div className="block-list">
                <p className="title">Block List</p>
                <div className="waper-group">
                    <ul>
                        {blockList.map((value, index) => {
                            return (
                                <li>
                                    <img src={value.ava} alt="photos"></img>
                                    <div className="waper-conten">
                                        <p>{value.name}</p>
                                        <p>{value.mess}</p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="waper-button">
                        <button className="btn-general-2">Block</button>
                        <button className="btn-general-1">Blocked</button>
                    </div>
                </div>


            </div>

        )
    }

    renderLanguage() {
        var { language, defaultValue } = this.state
        return (
            <div className="language">
                <p className="title">Language</p>
                <div className="select-general">
                    <Select className="react-select-container" classNamePrefix="react-select"
                        isSearchable={false}
                        options={language}
                        value={defaultValue}
                        onChange={(value) => this.handleChangeSelect(value)}
                    />
                </div>
            </div>
        )
    }

    renderMess() {
        var { language, defaultValue } = this.state
        return (
            <div className="mess">
                <p className="title">Message</p>
                <div className="waper-group">
                    <p>Platform</p>
                    <p>https://www.facebook.com</p>
                </div>
                <div className="waper-button">
                    <button className="btn-general-2">Save</button>
                </div>
                <ul>
                    <li>
                        <div>
                            <img src={Facebook} alt="photos"></img>
                            <p>https://www.facebook.com</p>
                        </div>
                        <button className="btn-general-1">Delete</button>
                    </li>
                    <li>
                        <div>
                            <img src={Twitt} alt="photos"></img>
                            <p>https://twitter.com/home</p>
                        </div>
                        <button className="btn-general-1">Delete</button>
                    </li>
                </ul>
            </div>
        )
    }

    renderAbout() {
        return (
            <div className="about">
                <p className="title">About Empo</p>
                <ul>
                    <li>Điều khoản dịch vụ</li>
                    <li>Điều khoản sử dụng</li>
                    <li>FAQ</li>
                    <li>Hướng dẫn sử dụng</li>
                </ul>
            </div>
        )
    }

    renderMenu() {
        return (
            <div className="menu">
                <p className="title">Setting</p>
                <ul>
                    <p>anhndp1234</p>
                    <li onClick={() => this.setState({ index: 'username' })}>Username</li>
                    <li onClick={() => this.setState({ index: 'blockList' })}>Block list</li>
                    <li onClick={() => this.setState({ index: 'language' })}>Language</li>
                    <li onClick={() => this.setState({ index: 'message' })}>Message</li>
                </ul>

                <ul>
                    <p>General</p>
                    <li onClick={() => this.setState({ index: 'about' })}>About Empo</li>
                    <li onClick={() => this.setState({ index: 'emads' })}>EmAds</li>
                </ul>
            </div>
        )
    }

    renderDetail() {
        var { index } = this.state;
        return (
            <div className="detail">
                {index === 'username' && this.renderUsername()}
                {index === 'blockList' && this.renderBlockList()}
                {index === 'language' && this.renderLanguage()}
                {index === 'message' && this.renderMess()}
                {index === 'about' && this.renderAbout()}
            </div>
        )
    }

    render() {
        var { index, key } = this.state
        return (
            <div>
                <Headers />
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    <Navbar></Navbar>
                    <div id="setting">
                        {this.renderMenu()}
                        {this.renderDetail()}
                    </div>
                </div>
            </div>
        )


    }
}

export default connect(state => ({
    myAddress: state.app.myAddress,
    myAccountInfo: state.app.myAccountInfo
}), ({
}))(SettingController)