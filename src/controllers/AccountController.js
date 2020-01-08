import React, { Component } from 'react'
import Headers from '../components/Header';
import Navbar from '../components/Navbar';
import RightNavbar from '../components/RightNavbar';
import Avatar from '../assets/images/avatar-big.svg'
import Mail from '../assets/images/Group 7451.svg'
import Fb from '../assets/images/Group 7450.svg'
import Noti from '../assets/images/Group 704.svg'
import CoverPhoto from '../assets/images/Rectangle 3121.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Icon from '../assets/images/Group 7447.svg'
import Loading from '../assets/images/loading.svg'
import Delete from '../assets/images/Union 28.svg'
import EmojiPicker from 'emoji-picker-react';
import Post from '../components/Post'
import Utils from '../utils'
import ServerAPI from '../ServerAPI';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import _ from 'lodash'
class AccountController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            level: 'S',
            date: '30 thg 11, 2019',
            data: [],
            accountInfo: {},
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

        var addressAccount = this.props.match.params.address

        var accountInfo = await ServerAPI.getAddress(addressAccount)

        var data = await ServerAPI.getMyPost(addressAccount, this.props.myAddress);

        var follow = await ServerAPI.getMyFollow(addressAccount);
        var follower = await ServerAPI.getMyFollower(addressAccount);

        var isFollowed = await ServerAPI.checkFollowed(this.props.myAddress, addressAccount)

        var totalMoney = 0
        data.forEach(post => {
            if (post.like && post.like.amount) {
                totalMoney += parseFloat(post.like.amount)
            }
        });

        this.setState({
            addressAccount,
            accountInfo,
            data,
            totalMoney,
            follow,
            follower,
            isFollowed
        })
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

            if (actionName === 'follow') {
                this.setState({
                    isFollowed: true
                })
            }

            if (actionName === 'unfollow') {
                this.setState({
                    isFollowed: false
                })
            }
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

    onFollow = (address, follow) => {
        this.setState({
            isLoadingFollow: true
        })

        if (follow === 'Unfollow') {
            this.onUnfollow(address)
            return;
        }
        const tx = window.empow.callABI("social.empow", "follow", [this.props.myAddress, address])
        this.action(tx, 'follow')
    }

    onUnfollow = (address) => {
        const tx = window.empow.callABI("social.empow", "unfollow", [this.props.myAddress, address])
        this.action(tx, 'unfollow')
    }

   
    renderInfo() {
        var { addressAccount, follow, follower, totalMoney, accountInfo, isLoadingFollow, isFollowed } = this.state
        var profile = accountInfo.profile || {}
        var followText = isFollowed ? 'Unfollow' : 'Follow'
        return (
            <div className="waper-info">
                <div className="waper-cover">
                    <img src={profile.cover ? profile.cover : CoverPhoto} alt="photos"></img>
                </div>
                <div className="group1">
                    <div className="avatar">
                        <img src={profile.avatar ? profile.avatar : Avatar} alt="photos"></img>
                    </div>

                    <div className="child">
                        <img src={Mail} alt="photos"></img>
                        <img src={Fb} alt="photos"></img>
                        <img src={Noti} alt="photos"></img>
                        {(this.props.myAddress && addressAccount !== this.props.myAddress) && <div>
                            <button className={`btn-general-2 ${isLoadingFollow ? 'btn-loading' : ''}`} style={isLoadingFollow ? { backgroundColor: '#dd3468' } : {}} onClick={() => this.onFollow(addressAccount, followText)}>
                                {isLoadingFollow && <img src={Loading} alt="photos"></img>}
                                {!isLoadingFollow && <span>{followText}</span>}
                            </button>
                        </div>}
                    </div>
                </div>
                <div className="group2">
                    <span>{addressAccount ? (accountInfo.selected_username ? accountInfo.selected_username : addressAccount.substr(0, 20) + '...') : ''}</span>
                    <p style={{ color: '#676f75', marginLeft: '20px' }}>Level: {Utils.convertLevel(accountInfo.level)}</p>
                </div>
                <div className="group2">
                    <p style={{ color: '#dd3468' }}>$ {totalMoney}</p>
                </div>
                <div className="group2">
                    <p><span>{follow}</span> follow</p>
                    <p><span>{follower}</span> follower</p>
                </div>
            </div>
        )
    }

    renderPost() {
        var { data } = this.state

        return (
            <ul className="waper-data">
                {data.map((value, index) => {
                    return <Post value={value}
                    togglePopup={this.togglePopup}
                    isHideFollow={true}></Post>
                })}
            </ul>
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
                                <img src={content} alt="photos" style={{ width: '100%' }}></img>
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

    render() {
        return (
            <div>
                <Headers />
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    <Navbar></Navbar>
                    <div id="account">
                        {this.renderInfo()}
                        {this.renderPost()}
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
}))(AccountController)