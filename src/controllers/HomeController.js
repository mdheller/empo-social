import React, { Component, useState } from 'react'
import Headers from '../components/Header';
import Online from '../assets/images/online.svg'
//import Offline from '../assets/images/offline.svg'
import { connect } from 'react-redux';
import Navbar from '../components/Navbar';
import Avatar from '../assets/images/avatar.svg'
import Photo from '../assets/images/Path 953.svg'
import Chart from '../assets/images/Group 599.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import Elip from '../assets/images/Ellipse 318.svg'
import Plus from '../assets/images/Group 605.svg'
import RightNavbar from '../components/RightNavbar';
import Heart from '../assets/images/Heart.svg'
import Delete from '../assets/images/Union 28.svg'
import Coment from '../assets/images/Path 1968.svg'
import Upload from '../assets/images/Group 613.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Pre from '../assets/images/Group 678.svg'
import Pluss from '../assets/images/Group 7448.svg'
import EmojiPicker from 'emoji-picker-react';

import ServerAPI from '../ServerAPI';
import Utils from '../utils'
import Buffer from 'buffer'
import ipfsAPI from 'ipfs-http-client'

class HomeController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            showMoreStatus: false,
            file: [],
            color: false,
            status: '',
            showEmoji: false,
            showShare: false,
            sharePostInfo: false,
            statusShare: '',
            showError: false,
            showSuccess: false,
        };
    };

    async componentDidMount() {
        var myAddress = await window.empow.enable()
        var data = await ServerAPI.getNewFeed();
        var country = await ServerAPI.getCountry()
        this.setState({
            data,
            myAddress,
            country
        })

    }

    onChangeBgColor = (color) => {
        this.setState({
            color
        })
    }


    upLoadPhoto = () => {
        if (this.state.file.length === 5) {
            return;
        }
        this.refs.fileUploader.click();
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

    onDeletePhoto = (index) => {
        var file = this.state.file;
        file.splice(index, 1)
        this.setState({
            file
        })
    }


    onEmojiClick = (event, emojiObject) => {
        var status = this.state.status;
        status += emojiObject.emoji
        var statusShare = this.state.statusShare;
        statusShare += emojiObject.emoji
        this.setState({
            status,
            statusShare
        })
    }

    handleChangeText = (event) => {
        this.setState({
            status: event.target.value
        });
    }

    handleChangeTextComment = (event, index) => {
        var data = this.state.data;
        data[index].commentText = event.target.value
        this.setState({
            data
        });
    }


    handleChangeTextReply = (event, indexx, index) => {
        var data = this.state.data;
        data[index].comment[indexx].replyText = event.target.value
        this.setState({
            data
        });
    }


    handleKeyDownComment = (e, post) => {
        if (e.key === 'Enter') {
            const tx = window.empow.callABI("social.empow", "comment", [this.state.myAddress, post.postId.toString(), "comment", "0", post.commentText])
            this.action(tx);
        }
    }

    handleKeyDownReply = (e, comment) => {
        if (e.key === 'Enter') {
            const tx = window.empow.callABI("social.empow", "comment", [this.state.myAddress, comment.postId, "reply", comment.commentId.toString(), comment.replyText])
            this.action(tx);
        }
    }

    togglePopup = (post) => {
        if (!this.state.showShare) {
            this.setState({
                showShare: true,
                sharePostInfo: post,
                statusShare: ''
            })
        } else {
            this.setState({
                showShare: false,
                sharePostInfo: false,
                showEmoji: false,
                color: false,
                file: [],
                status: ''
            })
        }

    }

    action = (tx) => {
        tx.addApprove("*", "unlimited")

        const handler = window.empow.signAndSend(tx)

        // handler.on("pending", (hash) => {
        //     addAlert("warning", `transaction on pending: ${hash}`)
        // })

        handler.on("failed", (error) => {
            console.log(error)
            this.setState({
                showError: error.toString()
            })
        })

        handler.on("success", (res) => {
            console.log(res)
            this.resetContent()
            this.setState({
                showSuccess: res.toString()
            })
        })
    }

    onLikePost = async (post) => {
        const tx = window.empow.callABI("social.empow", "like", [this.state.myAddress, post.postId])
        this.action(tx);
    }

    onPostStatus = async () => {
        const { myAddress, status, country } = this.state
        const _self = this;

        const reader = new FileReader();
        reader.onloadend = async function () {
            const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
            const buf = Buffer.Buffer(reader.result) // Convert data into buffer
            let progressPercent = (data) => {
                console.log(data);
            }
            ipfs.add(buf, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                let url = `https://ipfs.io/ipfs/${result[0].hash}`
                console.log(`Url --> ${url}`)

                const content = {
                    type: "photo",
                    data: url,
                    country: country.country_name,
                    city: country.city
                }

                const tx = window.empow.callABI("social.empow", "post", [myAddress, status, content, []])
                _self.action(tx)


            })
        }
        const photo = document.getElementById("file");
        reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
    }

    resetContent = () => {
        this.setState({
            status: '',
            file: []
        })
    }

    renderMoreStatus() {
        return (
            <div className="waper-more-status">
                <div className="waper-color">
                    <img src={Pre} alt="photos"></img>
                    <button style={{ backgroundColor: 'black' }} onClick={() => this.onChangeBgColor('black')}></button>
                    <button style={{ backgroundColor: 'red' }} onClick={() => this.onChangeBgColor('red')}></button>
                    <button style={{ backgroundColor: 'pink' }} onClick={() => this.onChangeBgColor('pink')}></button>
                    <button style={{ backgroundColor: 'green' }} onClick={() => this.onChangeBgColor('green')}></button>
                    <button style={{ backgroundColor: 'blue' }} onClick={() => this.onChangeBgColor('blue')}></button>
                    <button style={{ backgroundColor: '#ff6a7e' }} onClick={() => this.onChangeBgColor('#ff6a7e')}></button>
                    <button style={{ backgroundColor: 'orange' }} onClick={() => this.onChangeBgColor('orange')}></button>
                    <button style={{ backgroundColor: 'paleturquoise' }} onClick={() => this.onChangeBgColor('paleturquoise')}></button>
                    <button style={{ backgroundColor: 'purple' }} onClick={() => this.onChangeBgColor('purple')}></button>
                    <button style={{ backgroundColor: 'olivedrab' }} onClick={() => this.onChangeBgColor('olivedrab')}></button>
                    <button style={{ backgroundColor: 'crimson' }} onClick={() => this.onChangeBgColor('crimson')}></button>
                    <img src={Pluss} alt="photos"></img>
                </div>

                <div className="waper-hastag">
                    <button>
                        #dsaewqewqe
                        <div>
                            <p>x</p>
                        </div>
                    </button>

                    <button>
                        #dsaewqewqe
                        <div>
                            <p>x</p>
                        </div>
                    </button>

                    <button>
                        #dsaewqewqe
                        <div>
                            <p>x</p>
                        </div>
                    </button>
                </div>
            </div>
        )
    }

    renderPhotos() {
        return (
            <div>
                {this.state.file.map((value, index) => {
                    return (
                        <img style={{ marginRight: '10px' }} src={value} alt="photos" onClick={() => this.onDeletePhoto(index)}></img>
                    )
                })}
            </div>
        )
    }

    renderSharePost() {
        var value = this.state.sharePostInfo
        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup('showSend')}></div>
                    <div className="share-post">
                        <div className="group1">
                            <p>Repost lại thông tin này</p>
                            <img src={Delete} alt="photos"></img>
                        </div>

                        <div>
                            <textarea
                                value={this.state.statusShare}
                                onClick={() => { this.setState({ showMoreStatus: true }) }}
                                onChange={this.handleChangeText}
                                placeholder="Add comment"
                                style={{ backgroundColor: this.state.color ? this.state.color : '' }}></textarea>
                        </div>

                        <div className="group2 scroll">
                            <div className="info">
                                <div className="group">
                                    <div style={{ marginRight: '10px' }}>
                                        <img src={value.ava} alt="photos"></img>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{value.name}</p>
                                        <div className="title">
                                            <p>Cấp độ: {value.level}</p>
                                            <img src={Offline} alt="photos"></img>
                                            <p>{value.time}</p>
                                            <img src={Offline} alt="photos"></img>
                                            <p>{value.date}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn-general-2">Follow</button>
                                </div>
                            </div>

                            <div className="content">
                                <p>{value.content}</p>
                                <img src={value.image} alt="photos"></img>
                            </div>
                        </div>
                        {this.renderMoreStatus()}
                        <div className="waper-button">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div onClick={() => this.upLoadPhoto()} style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={Photo} alt="photos"></img>
                                    <input type="file" id="file" ref="fileUploader" style={{ display: "none" }} onChange={(event) => this.handleChange(event)} />
                                </div>
                                <img src={Chart} alt="photos"></img>
                                <img src={Gif} alt="photos"></img>
                                <div className="waper-emoji">
                                    <img onClick={() => { this.setState({ showEmoji: !this.state.showEmoji }) }} src={Icon} alt="photos"></img>
                                    {this.state.showEmoji && <div className="emoji-icon">
                                        <EmojiPicker onEmojiClick={this.onEmojiClick} />
                                    </div>}
                                </div>
                            </div>
                            <div style={{ justifyContent: 'center', display: 'flex' }}>
                                <img src={Elip} alt="photos"></img>
                                <img src={Plus} alt="photos"></img>
                                <button className="btn-general-1">Post</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    renderError() {
        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => { this.setState({ showError: false }) }}></div>
                    <div className="error">
                        <p>{this.state.showError}</p>
                    </div>
                </div>
            </div>
        )
    }

    renderSuccess() {
        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => { this.setState({ showSuccess: false }) }}></div>
                    <div className="error">
                        <p>{this.state.showSuccess}</p>
                    </div>
                </div>
            </div>
        )
    }

    renderStatus() {
        return (
            <div className="post" style={{ backgroundColor: this.state.color ? this.state.color : '' }}>
                <div style={{ flex: 0.1 }}>
                    <img src={Avatar} alt="photos"></img>
                </div>
                <div className="waper-content">
                    <textarea
                        value={this.state.status}
                        onClick={() => { this.setState({ showMoreStatus: true }) }}
                        onChange={this.handleChangeText}
                        placeholder="What are you thinking?"
                        style={{ backgroundColor: this.state.color ? this.state.color : '' }}></textarea>
                    {this.renderPhotos()}
                    {this.state.showMoreStatus && this.renderMoreStatus()}
                    <div className="waper-button">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div onClick={() => this.upLoadPhoto()} style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={Photo} alt="photos"></img>
                                <input type="file" id="file" ref="fileUploader" name="photo" style={{ display: "none" }} onChange={(event) => this.handleChange(event)} />
                            </div>
                            <img src={Chart} alt="photos"></img>
                            <img src={Gif} alt="photos"></img>
                            <div className="waper-emoji">
                                <img onClick={() => { this.setState({ showEmoji: !this.state.showEmoji }) }} src={Icon} alt="photos"></img>
                                {this.state.showEmoji && <div className="emoji-icon">
                                    <EmojiPicker onEmojiClick={this.onEmojiClick} />
                                </div>}
                            </div>
                        </div>
                        <div style={{ justifyContent: 'center', display: 'flex' }}>
                            <img src={Elip} alt="photos"></img>
                            <img src={Plus} alt="photos"></img>
                            <button className="btn-general-1" onClick={() => this.onPostStatus()}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderPost() {
        return (
            <ul className="waper-data">
                {this.state.data.map((value, index) => {
                    var like = value.like || {};
                    var comment = value.comment || []
                    var address = value.address || {}
                    return (
                        <li style={{ marginBottom: '50px' }}>
                            <div className="info">
                                <div className="group">
                                    <div style={{ marginRight: '10px' }}>
                                        <img src={Avatar} alt="photos"></img>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{value.author.substr(0, 5) + '...'}</p>
                                        <div className="title">
                                            <p style={{ color: '#dd3468' }}>$ {like.amount}</p>
                                            <p>Cấp độ: {address.level}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn-general-2">Follow</button>
                                </div>
                            </div>

                            <div className="content">
                                <p>{value.title}</p>
                                <img src={value.content.data} alt="photos"></img>
                            </div>

                            <div className="time">
                                <p>{Utils.convertDate(value.time)}</p>
                                <img src={Offline} alt="photos"></img>
                            </div>

                            <div className="reaction">
                                <div onClick={() => this.onLikePost(value)}>
                                    <img src={Heart} alt="photos"></img>
                                    <p>{value.totalLike}</p>
                                </div>

                                <div>
                                    <img src={Coment} alt="photos"></img>
                                    <p>{value.totalComment}</p>
                                </div>

                                <div onClick={() => this.togglePopup(value)}>
                                    <img src={Upload} alt="photos"></img>
                                    <p>{value.totalReport}</p>
                                </div>


                            </div>

                            <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                <div>
                                    <img src={Avatar} alt="photos"></img>
                                </div>
                                <div className="waper-cmt">
                                    <input value={value.commentText}
                                        placeholder="Coment"
                                        disabled={window.empow ? false : true}
                                        onChange={(e) => this.handleChangeTextComment(e, index)}
                                        onKeyDown={(e) => this.handleKeyDownComment(e, value)}></input>
                                    <div>
                                        <img src={Photo} alt="photos"></img>
                                        <img src={Gif} alt="photos"></img>
                                        <img src={Icon} alt="photos"></img>
                                    </div>
                                </div>
                            </div>
                            <ul className="coment scroll">
                                {comment.map((detail, indexx) => {
                                    var addressComment = detail.address || [];
                                    return (
                                        <li>
                                            <div className="info">
                                                <div className="group">
                                                    <div className="waper-avatar" style={{ marginRight: '10px' }}>
                                                        <img src={addressComment.profile && addressComment.profile.avatar && addressComment.profile.avatar !== "" ? addressComment.profile.avatar : Avatar} alt="photos"></img>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold' }}>{addressComment.address}</p>
                                                        <div className="title">
                                                            <p>Cấp độ: {addressComment.level}</p>
                                                            <img src={Offline} alt="photos"></img>
                                                            <p>{Utils.convertDate(detail.time)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p style={{ marginLeft: '45px' }}>{detail.content}</p>

                                            <div className="reaction">
                                                <div>
                                                    <img src={Coment} alt="photos"></img>
                                                    <p>{detail.totalReply}</p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                                <div>
                                                    <img src={Avatar} alt="photos"></img>
                                                </div>
                                                <div className="waper-cmt">
                                                    <input value={detail.replyText}
                                                        placeholder="Coment"
                                                        disabled={window.empow ? false : true}
                                                        onChange={(e) => this.handleChangeTextReply(e, indexx, index)}
                                                        onKeyDown={(e) => this.handleKeyDownReply(e, detail)}></input>
                                                    <div>
                                                        <img src={Photo} alt="photos"></img>
                                                        <img src={Gif} alt="photos"></img>
                                                        <img src={Icon} alt="photos"></img>
                                                    </div>
                                                </div>
                                            </div>

                                        </li>
                                    )
                                })}

                            </ul>

                        </li>
                    )
                })}
            </ul>
        )
    }

    render() {
        return (
            <div>
                <Headers />
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    <Navbar></Navbar>
                    <div id="home">
                        {window.empow && this.renderStatus()}
                        {this.renderPost()}
                        {(this.state.showShare && this.state.sharePostInfo) && this.renderSharePost()}
                        {this.state.showError && this.renderError()}
                        {this.state.showSuccess && this.renderSuccess()}
                    </div>
                    <RightNavbar></RightNavbar>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
}), ({
}))(HomeController)