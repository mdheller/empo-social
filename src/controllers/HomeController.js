import React, { Component, useState } from 'react'
import Headers from '../components/Header';
import Navbar from '../components/Navbar';
import Avatar from '../assets/images/avatar.svg'
import Photo from '../assets/images/Path 953.svg'
import Chart from '../assets/images/Group 599.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import RightNavbar from '../components/RightNavbar';
import Delete from '../assets/images/Union 28.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Pre from '../assets/images/Group 678.svg'
import Pluss from '../assets/images/Group 7448.svg'
import EmojiPicker from 'emoji-picker-react';
import ServerAPI from '../ServerAPI';
import Utils from '../utils'
import Buffer from 'buffer'
import ipfsAPI from 'ipfs-http-client'
import tagsInput from 'tags-input'
import $ from "jquery";
import { connect } from 'react-redux';
import Loading from '../assets/images/loading.svg'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import Post from '../components/Post'

import _ from 'lodash'

class HomeController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            showMoreStatus: false,
            file: false,
            color: false,
            status: '',
            showEmoji: false,
            showShare: false,
            sharePostInfo: false,
            statusShare: '',
            tags: [],
            isLoadingPost: false,
            isLoadingSharePost: false,
            isLoadingFollow: false
        };
    };

    componentDidUpdate(pre) {
        if (_.isEqual(pre, this.props)) {
            return;
        }
        this.getData()
    }

    getData = async () => {
        if (!this.props.myAddress) {
            return;
        }

        var data = await ServerAPI.getNewFeed(this.props.myAddress, this.props.typeNewFeed);
        var country = await ServerAPI.getCountry()
        this.setState({
            data,
            country
        })
    }

    log(e) {
        $('#out')[0].textContent = `${e.type}: ${this.value.replace(/,/g, ', ')}`;
    }

    onChangeBgColor = (color) => {
        this.setState({
            color
        })
    }


    upLoadPhoto = () => {
        this.refs.fileUploader.click();
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            var file = URL.createObjectURL(event.target.files[0]);
            this.setState({
                file,
                typeFile: event.target.files[0].type
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

    handleChangeTextShare = (event) => {
        this.setState({
            statusShare: event.target.value
        });
    }

    togglePopup = async (post) => {
        if (!this.state.showShare) {
            this.setState({
                showShare: true,
                sharePostInfo: post,
                statusShare: '',
            })
        } else {
            this.setState({
                showShare: false,
                sharePostInfo: false,
                showEmoji: false,
                color: false,
                file: [],
                status: '',
            })
        }

    }

    action = (tx, actionName = false, data = false) => {
        tx.addApprove("*", "unlimited")

        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            console.log(error)
            var msg = error.message ? error.message.split("Error: ") : error.split('message":"')
            var text = error.message ? msg[2] : msg[1]
            this.setState({
                isLoadingPost: false,
                isLoadingSharePost: false,
                isLoadingFollow: false
            })

            Alert.error(text, {
                position: 'bottom-left',
                effect: 'slide',
            });
        })

        handler.on("success", (res) => {
            console.log(res)

            if (!actionName) {
                this.resetContent()
            }

            if (actionName === "post") {
                this.onPostSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[0], data);
            }

            if (actionName === "share") {
                this.onShareSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[0], data);
            }
        })
    }

    onSharePost = async () => {
        this.setState({
            isLoadingSharePost: true
        })
        var { sharePostInfo, statusShare } = this.state
        const tx = window.empow.callABI("social.empow", "share", [this.props.myAddress, sharePostInfo.postId, statusShare])
        this.action(tx, "share", { type: "share", data: sharePostInfo.postId.toString() });
    }

    onShareSuccess = (postId, content) => {
        var { sharePostInfo } = this.state
        var post = {
            postId,
            content,
            realLike: 0,
            title: this.state.statusShare,
            time: new Date().getTime() * 10 ** 6,
            totalComment: 0,
            totalCommentAndReply: 0,
            totalLike: 0,
            totalShare: 0,
            showContent: true,
            author: this.props.myAddress,
            postShare: sharePostInfo,
            address: this.props.myAccountInfo
        }

        post.postShare.addressPostShare = post.postShare.address

        var data = [...this.state.data]
        data.unshift(post);
        this.setState({
            data
        })

        this.resetContent()
    }

    onPostStatus = async () => {
        this.setState({
            isLoadingPost: true
        })

        const { status, country, typeFile } = this.state
        const _self = this;

        var tagContent = $('input[type="tags"]')[0].value;
        tagContent = tagContent.split(",")

        var tag = []
        for (let j = 0; j < tagContent.length; j++) {
            tag.push(tagContent[j].trim())
        }

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
                    type: typeFile === 'video/mp4' ? "video" : "photo",
                    data: url,
                    country: country.country_name,
                    city: country.city
                }

                const tx = window.empow.callABI("social.empow", "post", [_self.props.myAddress, status, content, tag])
                _self.action(tx, "post", content)
            })
        }
        const photo = document.getElementById("file");
        reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
    }

    onPostSuccess = (postId, content) => {
        var post = {
            postId,
            content,
            realLike: 0,
            title: this.state.status,
            time: new Date().getTime() * 10 ** 6,
            totalComment: 0,
            totalCommentAndReply: 0,
            totalLike: 0,
            totalShare: 0,
            showContent: true,
            author: this.props.myAddress,
            address: this.props.myAccountInfo
        }

        var data = this.state.data;
        data.unshift(post);
        this.setState({
            data
        })

        this.resetContent()
    }

    resetContent = () => {
        this.setState({
            status: '',
            file: false,
            sharePostInfo: false,
            statusShare: '',
            tags: [],
            isLoadingPost: false,
            isLoadingSharePost: false,
            isLoadingFollow: false
        })
    }

    onChangeTagsInput = (e) => {
        if (e.key === 'Enter') {
            let $ = s => [].slice.call(document.querySelectorAll(s));
            $('input[type="tags"]').forEach(tagsInput);
        }
    }

    onClickTag = () => {
        $('.tag').click(function () {
            $(this).remove()
        });
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

                <div className="waper-hastag" onClick={() => this.onClickTag()}>
                    <input type="tags" placeholder="hashtag" id="tags" onKeyDown={this.onChangeTagsInput} />
                </div>
            </div>
        )
    }

    renderPhotos() {
        return (
            <div className="waper-content-photo">
                {this.state.typeFile !== 'video/mp4' && <img style={{ marginRight: '10px' }} src={this.state.file} alt="photos"></img>}
                {this.state.typeFile === 'video/mp4' && <video src={this.state.file} controls></video>}

            </div>
        )
    }

    renderSharePost() {
        var { isLoadingSharePost } = this.state
        var value = this.state.sharePostInfo

        var postShare = value.content.type === 'share' ? value.postShare : false;

        var address = {}
        var profile = {}
        var author = value.author
        var time = value.time
        var title = value.title
        var content = value.content.data
        if (postShare) {
            address = postShare.addressPostShare || {}
            profile = postShare.addressPostShare && postShare.addressPostShare.profile ? postShare.addressPostShare.profile : {}
            author = postShare.author;
            time = postShare.time
            title = postShare.title
            content = postShare.content.data
        } else {
            address = value.address || {}
            profile = value.address && value.address.profile ? value.address.profile : {}
        }

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => this.togglePopup('showSend')}></div>
                    <div className="share-post">
                        <div className="group1">
                            <p>Share this post</p>
                            <img onClick={() => this.togglePopup('showSend')} src={Delete} alt="photos"></img>
                        </div>

                        <div>
                            <textarea
                                value={this.state.statusShare}
                                onClick={() => { this.setState({ showMoreStatus: true }) }}
                                onChange={this.handleChangeTextShare}
                                placeholder="Add comment"
                                style={{ backgroundColor: this.state.color ? this.state.color : '' }}></textarea>
                        </div>
                        <div className="group2 scroll">
                            <div className="info">
                                <div className="group">
                                    <div style={{ marginRight: '10px' }} onClick={() => this.onClickAddress(author)} >
                                        <img className="waper-ava" src={profile.avatar ? profile.avatar : Avatar} alt="photos"></img>
                                    </div>
                                    <div>
                                        <p onClick={() => this.onClickAddress(author)} style={{ fontWeight: 'bold', fontSize: '20px' }}>{address.selected_username ? address.selected_username : author.substr(0, 20) + '...'}</p>
                                        <div className="title">
                                            <p>{Utils.convertLevel(address.level)}</p>
                                            <img src={Offline} alt="photos"></img>
                                            <p>{Utils.convertDate(time)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="content">
                                <p>{title}</p>
                                <img src={content} style={{ width: '100%' }} alt="photos"></img>
                            </div>
                        </div>
                        <div className="waper-button">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="waper-emoji">
                                    <img onClick={() => { this.setState({ showEmoji: !this.state.showEmoji }) }} src={Icon} alt="photos"></img>
                                    {this.state.showEmoji && <div className="emoji-icon">
                                        <EmojiPicker onEmojiClick={this.onEmojiClick} />
                                    </div>}
                                </div>
                            </div>
                            <div style={{ justifyContent: 'center', display: 'flex' }}>
                                <button className={`btn-general-1 ${isLoadingSharePost ? 'btn-loading' : ''}`} onClick={() => this.onSharePost()}>
                                    {isLoadingSharePost && <img src={Loading} alt="photos"></img>}
                                    {!isLoadingSharePost && <span>Post</span>}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    renderStatus() {
        var { myAccountInfo } = this.props;
        var { isLoadingPost } = this.state
        var profile = myAccountInfo.profile || {}
        return (
            <div className="post" style={{ backgroundColor: this.state.color ? this.state.color : '' }}>
                <div style={{ flex: 0.1 }}>
                    <img src={profile.avatar ? profile.avatar : Avatar} alt="photos" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></img>
                </div>
                <div className="waper-content">
                    <textarea
                        value={this.state.status}
                        onClick={() => { this.setState({ showMoreStatus: true }) }}
                        onChange={this.handleChangeText}
                        placeholder="What are you thinking?"
                        style={{ backgroundColor: this.state.color ? this.state.color : '' }}></textarea>
                    {this.state.file && this.renderPhotos()}
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
                            <button className={`btn-general-1 ${isLoadingPost ? 'btn-loading' : ''}`} onClick={() => this.onPostStatus()}>
                                {isLoadingPost && <img src={Loading} alt="photos"></img>}
                                {!isLoadingPost && <span>Post</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderPosts() {
        return (
            <ul>
                {this.state.data.map((value, index) => {
                    return <Post value={value}
                        togglePopup={this.togglePopup}></Post>
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
                        {this.props.myAddress && this.renderStatus()}
                        {this.renderPosts()}
                        {(this.state.showShare && this.state.sharePostInfo && this.props.myAddress) && this.renderSharePost()}
                    </div>
                    <RightNavbar></RightNavbar>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    myAddress: state.app.myAddress,
    myAccountInfo: state.app.myAccountInfo,
    typeNewFeed: state.app.typeNewFeed
}), ({
}))(HomeController)