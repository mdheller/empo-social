import React, { Component } from 'react'
import Headers from '../components/Header';

import Navbar from '../components/Navbar';
import RightNavbar from '../components/RightNavbar';
import ServerAPI from '../ServerAPI';
import Utils from '../utils'

import Avatar from '../assets/images/avatar.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Icon from '../assets/images/Group 7447.svg'
import Delete from '../assets/images/Union 28.svg'
import EmojiPicker from 'emoji-picker-react';
import Loading from '../assets/images/loading.svg'
import { connect } from 'react-redux';
import Post from '../components/Post'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import moment from 'moment'
import _ from 'lodash'
import YouTube from 'react-youtube';

class PostDetailController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            postId: this.getPostId(),
            textComment: '',
            postDetail: {},
            showShare: false,
            sharePostInfo: false,
            statusShare: '',
            isLoadingSharePost: false,
            isLoadingFollow: false
        };
    };

    async componentDidUpdate(pre) {
        if (_.isEqual(pre, this.props)) {
            return;
        }

        var { postId } = this.state

        if (!postId || postId === "" || postId === null) {
            return;
        }

        var postDetail = await ServerAPI.getPostDetailByPostId(postId, this.props.myAddress)
        this.setState({
            postDetail,
        })
    }

    getPostId() {
        if (this.props.match && this.props.match.params) {
            return this.props.match.params.postId
        }

        return '';
    }

    action = (tx, actionName = false, data = false) => {
        tx.addApprove("*", "unlimited")

        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            var msg = error.message.split("Error: ")
            this.setState({
                isLoadingSharePost: false,
                isLoadingFollow: false
            })

            Alert.error(msg[2], {
                position: 'bottom-left',
                effect: 'slide',
            });
        })

        handler.on("success", (res) => {
            console.log(res)
            this.resetContent()
        })
    }


    resetContent = () => {
        this.setState({
            sharePostInfo: false,
            statusShare: '',
            isLoadingSharePost: false,
            isLoadingFollow: false
        })
    }

    onSharePost = async () => {
        this.setState({
            isLoadingSharePost: true
        })

        var { sharePostInfo, statusShare } = this.state
        const tx = window.empow.callABI("social.empow", "share", [this.props.myAddress, sharePostInfo.postId, statusShare])
        this.action(tx);
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
        var type = value.content.type
        if (postShare) {
            address = postShare.addressPostShare || {}
            profile = postShare.addressPostShare && postShare.addressPostShare.profile ? postShare.addressPostShare.profile : {}
            author = postShare.author;
            time = postShare.time
            title = postShare.title
            content = postShare.content.data
            type = postShare.content.type
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
                                            <p>{moment(time / 10**6).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="content">
                                <p>{title}</p>
                                {type === 'video' && <video src={content} controls></video>}
                                {type === 'photo' && <img src={content} style={{ width: '100%' }} alt="photos"></img>}
                                {type === 'youtube' && <YouTube
                                    videoId={Utils.getVideoIdYoutube(content)}
                                    opts={{ width: '100%' }}
                                />}
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

    renderDetail() {
        var {postDetail} = this.state;
        if (!postDetail.author) {
            return <div></div>
        }
        return <Post value={postDetail}
        togglePopup={this.togglePopup}></Post>
    }

    render() {
        return (
            <div>
                <Headers />
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    <Navbar></Navbar>
                    <div id="post-detail">
                        {this.renderDetail()}
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
}), ({
}))(PostDetailController)