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
import Heart from '../assets/images/Heart.svg'
import Heart2 from '../assets/images/Heart2.svg'
import Coment from '../assets/images/Path 1968.svg'
import Upload from '../assets/images/Group 613.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import Photo from '../assets/images/Path 953.svg'
import Avatar3 from '../assets/images/avatar.svg'
import Loading from '../assets/images/loading.svg'
import Delete from '../assets/images/Union 28.svg'
import EmojiPicker from 'emoji-picker-react';

import Utils from '../utils'
import ServerAPI from '../ServerAPI';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

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
            accountInfoSharePost: false,
            isLoadingSharePost: false,
            isLoadingFollow: false
        };
    };

    async componentDidMount() {

        var addressAccount = this.props.match.params.address

        var accountInfo = await ServerAPI.getAddress(addressAccount)

        var data = await ServerAPI.getMyPost(addressAccount);

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
            var accountInfoSharePost = await ServerAPI.getAddress(post.author)

            this.setState({
                showShare: true,
                sharePostInfo: post,
                statusShare: '',
                accountInfoSharePost
            })
        } else {
            this.setState({
                showShare: false,
                sharePostInfo: false,
                showEmoji: false,
                color: false,
                file: [],
                status: '',
                accountInfoSharePost: false
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

            if (actionName === "like") {
                this.onLikeSuccess(data)
            }

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

            if (actionName === 'comment') {
                this.onCommentSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[1], data)
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

    onClickAddress = (address) => {
        window.location = '/account/' + address
    }

    onClickReply = (index, indexx) => {
        var data = this.state.data;
        data[index].comment[indexx].showReply = !data[index].comment[indexx].showReply
        this.setState({
            data
        });
    }

    onClickTitle = (postId) => {
        window.location = '/post-detail/' + postId
    }

    onLikePost = async (post) => {
        if (!this.props.myAddress) {
            return;
        }
        const tx = window.empow.callABI("social.empow", "like", [this.props.myAddress, post.postId])
        this.action(tx, 'like', post);
    }

    onLikeSuccess = (post) => {
        post.isLiked = true;
        post.totalLike = post.totalLike + 1
        var data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].postId === post.postId) {
                data[i] = post;
                break;
            }
        }

        this.setState({
            data
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

    handleChangeTextComment = (event, index) => {
        var data = this.state.data;
        data[index].commentText = event.target.value
        this.setState({
            data
        });
    }

    handleKeyDownComment = (e, post) => {
        if (e.key === 'Enter') {
            var data = {
                postId: post.postId,
                content: post.commentText,
            }

            const tx = window.empow.callABI("social.empow", "comment", [this.props.myAddress, post.postId.toString(), "comment", "0", post.commentText])
            this.action(tx, "comment", data);
        }
    }

    onCommentSuccess = (commentId, obj) => {
        const cmt = {
            commentId: commentId,
            postId: obj.postId,
            address: this.props.myAccountInfo,
            content: obj.content,
            parentId: -1,
            totalReply: 0,
            type: "comment",
            time: new Date().getTime() * 10 ** 6,
        }

        var data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].postId === obj.postId) {
                data[i].comment.unshift(cmt)
                data[i].commentText = ''
                break;
            }
        }

        this.setState({
            data
        })
    }

    handleChangeTextReply = (event, indexx, index) => {
        var data = this.state.data;
        data[index].comment[indexx].replyText = event.target.value
        this.setState({
            data
        });
    }

    handleKeyDownReply = (e, comment) => {
        if (e.key === 'Enter') {
            const tx = window.empow.callABI("social.empow", "comment", [this.props.myAddress, comment.postId, "reply", comment.commentId.toString(), comment.replyText])
            this.action(tx);
        }
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
        var { myAccountInfo } = this.props
        var myProfile = myAccountInfo.profile || {}

        return (
            <ul className="waper-data">
                {data.map((value, index) => {
                    var comment = value.comment || []
                    return (
                        <li style={{ marginBottom: '50px' }}>
                            <div className="content">
                                <h1 style={{ cursor: 'pointer' }} onClick={() => this.onClickTitle(value.postId)}>{value.title}</h1>
                                <div className="time">
                                    <p style={{ color: '#dd3468' }}>$ {value.realLike}</p>
                                    <div className="time">
                                        <p>{Utils.convertDate(value.time)}</p>
                                        <img src={Offline} alt="photos"></img>
                                    </div>
                                </div>
                                <img className="waper-img" src={value.content.data} alt="photos"></img>
                            </div>

                            <div className="reaction">
                                {!value.isLiked && <div onClick={() => this.onLikePost(value)}>
                                    <img src={Heart} alt="photos"></img>
                                    <p>{value.totalLike}</p>
                                </div>}

                                {value.isLiked && <div>
                                    <img src={Heart2} alt="photos"></img>
                                    <p>{value.totalLike}</p>
                                </div>}

                                <div>
                                    <img src={Coment} alt="photos"></img>
                                    <p>{value.totalComment}</p>
                                </div>

                                <div onClick={() => this.togglePopup(value)}>
                                    <img src={Upload} alt="photos"></img>
                                    <p>{value.totalReport}</p>
                                </div>
                            </div>

                            {this.props.myAddress && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                <div className="waper-avatar">
                                    <img src={myProfile.avatar ? myProfile.avatar : Avatar3} alt="photos"></img>
                                </div>

                                <div className="waper-cmt">
                                    <input value={value.commentText}
                                        placeholder="Coment"
                                        onChange={(e) => this.handleChangeTextComment(e, index)}
                                        onKeyDown={(e) => this.handleKeyDownComment(e, value)}></input>
                                    <div>
                                        <img src={Photo} alt="photos"></img>
                                        <img src={Gif} alt="photos"></img>
                                        <img src={Icon} alt="photos"></img>
                                    </div>
                                </div>
                            </div>}

                            {(comment && comment.length > 0) && <ul className="coment scroll">
                                {comment.map((detail, indexx) => {
                                    var addressComment = detail.address || [];
                                    var pro5 = addressComment.profile || {}
                                    return (
                                        <li>
                                            <div className="info">
                                                <div className="group">
                                                    <div className="waper-avatar" style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => this.onClickAddress(addressComment.address)}>
                                                        <img src={pro5.avatar ? pro5.avatar : Avatar3} alt="photos"></img>
                                                    </div>

                                                    <div>
                                                        <p onClick={() => this.onClickAddress(addressComment.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressComment.selected_username ? addressComment.selected_username : addressComment.address}</p>
                                                        <div className="title">
                                                            <p>{Utils.convertLevel(addressComment.level)}</p>
                                                            <img src={Offline} alt="photos"></img>
                                                            <p>{Utils.convertDate(detail.time)} hour</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p style={{ marginLeft: '45px' }}>{detail.content}</p>

                                            <div className="reaction">
                                                <p onClick={() => this.onClickReply(index, indexx)} style={{ cursor: 'pointer' }}>Reply</p>
                                            </div>

                                            {(this.props.myAddress && detail.showReply) && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                                <div className="waper-avatar">
                                                    <img src={myProfile.avatar ? myProfile.avatar : Avatar3} alt="photos"></img>
                                                </div>
                                                <div className="waper-cmt">
                                                    <input value={detail.replyText}
                                                        placeholder="Coment"
                                                        onChange={(e) => this.handleChangeTextReply(e, indexx, index)}
                                                        onKeyDown={(e) => this.handleKeyDownReply(e, detail)}></input>
                                                    <div>
                                                        <img src={Photo} alt="photos"></img>
                                                        <img src={Gif} alt="photos"></img>
                                                        <img src={Icon} alt="photos"></img>
                                                    </div>
                                                </div>
                                            </div>}

                                        </li>
                                    )
                                })}

                            </ul>}

                        </li>
                    )
                })}
            </ul>
        )
    }

    renderSharePost() {
        var { isLoadingFollow, isLoadingSharePost, isFollowed } = this.state
        var value = this.state.sharePostInfo
        var accountInfoSharePost = this.state.accountInfoSharePost
        var address = value.address || {}
        var profile = accountInfoSharePost && accountInfoSharePost.profile ? accountInfoSharePost.profile : []
        var follow = isFollowed ? 'Unfollow' : 'Follow'
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
                                    <div style={{ marginRight: '10px' }} onClick={() => this.onClickAddress(value.author)} >
                                        <img className="waper-ava" src={profile.avatar ? profile.avatar : Avatar} alt="photos"></img>
                                    </div>
                                    <div>
                                        <p onClick={() => this.onClickAddress(value.author)} style={{ fontWeight: 'bold', fontSize: '20px' }}>{value.selected_username ? value.selected_username : value.author.substr(0, 20) + '...'}</p>
                                        <div className="title">
                                            <p>{Utils.convertLevel(address.level)}</p>
                                            <img src={Offline} alt="photos"></img>
                                            <p>{Utils.convertDate(value.time)}</p>
                                        </div>
                                    </div>
                                </div>
                                {(this.props.myAddress && value.author !== this.props.myAddress) && <div>
                                    <button className={`btn-general-2 ${isLoadingFollow ? 'btn-loading' : ''}`} style={isLoadingFollow ? { backgroundColor: '#dd3468' } : {}} onClick={() => this.onFollow(value.author, follow)}>
                                        {isLoadingFollow && <img src={Loading} alt="photos"></img>}
                                        {!isLoadingFollow && <span>{follow}</span>}
                                    </button>
                                </div>}
                            </div>

                            <div className="content">
                                <p>{value.title}</p>
                                <img src={value.content.data} alt="photos" style={{ width: '100%' }}></img>
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