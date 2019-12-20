import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Gif from '../assets/images/Group 695.svg'
import Avatar from '../assets/images/avatar.svg'
import Emoji from '../assets/images/Group 697.svg'
import Chart from '../assets/images/Group 694.svg'
import Arrow from '../assets/images/Arrow.svg'
import IconSearch from '../assets/images/Search2.svg'
import Setting from '../assets/images/Path 1991.svg'
import Setting2 from '../assets/images/Path 1993.svg'
import Delete from '../assets/images/Union 22.svg'
import Photos from '../assets/images/Path 1992.svg'
import Heart from '../assets/images/Heart2.svg'
import EmojiPicker from 'emoji-picker-react';
import Noti from '../assets/images/notifications-button2.svg'
import Leave from '../assets/images/logout.svg'
import Group from '../assets/images/Group 698.svg'
import Block from '../assets/images/Group 700.svg'

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    ava: Avatar,
                    name: 'ABCSADS',
                    content: 'alo! Hello',
                    time: '15:56',
                    noti: 425
                },
                {
                    ava: Avatar,
                    name: 'ABCSADS',
                    content: 'alo! Hello',
                    time: '15:56',
                    noti: 425
                },
                {
                    ava: Avatar,
                    name: 'ABCSADS',
                    content: 'alo! Hello',
                    time: '15:56',
                    noti: 425
                },
                {
                    ava: Avatar,
                    name: 'ABCSADS',
                    content: 'alo! Hello',
                    time: '15:56',
                    noti: 425
                },
                {
                    ava: Avatar,
                    name: 'ABCSADS',
                    content: 'alo! Hello',
                    time: '15:56',
                    noti: 425
                },
            ],
            index: 0,
            showChat: false,
            info: null,
            showContentMess: true,
            file: [],
            showEmoji: false,
            showSetting: false
        }
    };

    upLoadPhoto = () => {
        if (this.state.file.length === 5) {
            console.log(1)
            return;
        }
        this.refs.fileUploader.click();
    }

    onEmojiClick = (event, emojiObject) => {
        // var status = this.state.status;
        // status += emojiObject.emoji
        // this.setState({
        //     status
        // })
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            var img = URL.createObjectURL(event.target.files[0]);
            var file = this.state.file;
            file.push(img)
            this.setState({
                file
            })
        }
    }

    renderContentMess() {
        return (
            <div>
                <div className="scroll">

                </div>

                <div className="group2">
                    <input placeholder="Mess"></input>
                    <div className="child">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div onClick={() => this.upLoadPhoto()} style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={Photos} alt="photos"></img>
                                <input type="file" id="file" ref="fileUploader" style={{ display: "none" }} onChange={(event) => this.handleChange(event)} />
                            </div>
                            <img src={Chart} alt="photos"></img>
                            <img src={Gif} alt="photos"></img>
                            <div className="waper-emoji">
                                <img onClick={() => { this.setState({ showEmoji: !this.state.showEmoji }) }} src={Emoji} alt="photos"></img>
                                {this.state.showEmoji && <div className="emoji-icon">
                                    <EmojiPicker onEmojiClick={this.onEmojiClick} />
                                </div>}
                            </div>
                        </div>

                        <div>
                            <img src={Heart} alt="photos"></img>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderMess(info) {
        var { showContentMess, showSetting } = this.state
        return (
            <div className="waper-mess" style={{ bottom: showContentMess ? '420px' : '50px' }}>
                <div className="group1" >
                    <div className="child" onClick={() => this.setState({ showContentMess: !this.state.showContentMess, showSetting: false, showEmoji: false })}>
                        <img src={Avatar} alt="photos"></img>
                        <p>{info.name}</p>
                    </div>
                    <div className="child">
                        <div className="waper-setting">
                            <img src={Setting2} alt="photos" onClick={() => { this.setState({ showSetting: !this.state.showSetting }) }}></img>
                            {showSetting && <div className="setting">
                                <div onClick={() => { this.setState({ showSetting: false }) }}>
                                    <img src={Noti} alt="photos"></img>
                                    <p>Tắt thông báo</p>
                                </div>
                                <div onClick={() => { this.setState({ showSetting: false }) }}>
                                    <img src={Leave} alt="photos"></img>
                                    <p>Rời khỏi</p>
                                </div>
                                <div onClick={() => { this.setState({ showSetting: false }) }}>
                                    <img src={Group} alt="photos"></img>
                                    <p>Tạo nhóm</p>
                                </div>
                                <div onClick={() => { this.setState({ showSetting: false }) }}>
                                    <img src={Block} alt="photos"></img>
                                    <p>Chặn</p>
                                </div>
                            </div>}
                        </div>
                        <img src={Delete} alt="photos" onClick={() => { this.setState({ info: false }) }}></img>
                    </div>
                </div>
                {showContentMess && this.renderContentMess()}
            </div>
        )
    }


    renderShowChat() {
        var { data, index } = this.state
        return (
            <div>
                <div className="menu">
                    <p onClick={() => this.setState({ index: 0 })}
                        className={index === 0 ? "active" : ""}>Gần đây</p>
                    <p onClick={() => this.setState({ index: 1 })}
                        className={index === 1 ? "active" : ""}>Đang chờ</p>
                </div>
                <ul className="scroll">
                    {data.map((value, index) => {
                        return (
                            <li>
                                <div className="info" onClick={() => { this.setState({ info: value, showContentMess: true, showEmoji: false, showSetting: false }) }}>
                                    <img src={value.ava} alt="photos"></img>
                                    <div>
                                        <p style={{ color: 'black', fontSize: '14px', marginBottom: '5px' }}>{value.name}</p>
                                        <p>{value.content}</p>
                                    </div>
                                </div>

                                <div>
                                    <p>{value.time}</p>
                                    <p className="noti">{value.noti}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <div className="waper-search">
                    <img src={IconSearch} alt="photos"></img>
                    <input placeholder="Search"></input>
                    <img src={Setting} alt="photos"></img>
                </div>
            </div>
        )
    }

    render() {
        var { showChat, info } = this.state
        return (
            <div className="chat">
                <div className="waper-button" onClick={() => { this.setState({ showChat: !this.state.showChat }) }}>
                    <img src={Arrow} alt="photos"></img>
                </div>
                {showChat && this.renderShowChat()}
                {info && this.renderMess(info)}
            </div>
        );
    }
};

export default connect(state => ({
    // loggedIn: state.app.loggedIn,
}), ({
}))(Chat)