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
            accountInfoSharePost: false,
            isLoadingSharePost: false,
            isLoadingFollow: false
        };
    };

    async componentDidMount() {
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

    handleChangeTextComment = (event) => {
        this.setState({
            textComment: event.target.value
        });
    }

    handleKeyDownComment = (e) => {
        var { postId, textComment } = this.state

        if (e.key === 'Enter') {
            const tx = window.empow.callABI("social.empow", "comment", [this.props.myAddress, postId.toString(), "comment", "0", textComment])
            this.action(tx, 'comment');
        }
    }

    onCommentSuccess = (commentId) => {
        var { postId, textComment } = this.state

        const cmt = {
            commentId: commentId,
            postId: postId,
            address: this.props.myAccountInfo,
            content: textComment,
            parentId: -1,
            totalReply: 0,
            type: "comment",
            time: new Date().getTime() * 10 ** 6,
        }

        var postDetail = this.state.postDetail;
        postDetail.comment.unshift(cmt)
        postDetail.commentText = ''

        this.setState({
            postDetail
        })
    }

    handleChangeTextReply = (event, indexx) => {
        var postDetail = this.state.postDetail;
        postDetail.comment[indexx].replyText = event.target.value
        this.setState({
            postDetail
        });
    }

    handleKeyDownReply = (e, comment) => {
        var { postId } = this.state
        if (e.key === 'Enter') {
            const tx = window.empow.callABI("social.empow", "comment", [this.props.myAddress, postId, "reply", comment.commentId.toString(), comment.replyText])
            this.action(tx);
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

            if (actionName === "follow") {
                this.resetContent()
                this.onFollowSuccess()
            }

            if (actionName === "unfollow") {
                this.resetContent()
                this.onUnfollowSuccess()
            }

            if (actionName === 'comment') {
                this.onCommentSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[1])
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

    onUnfollow = (address) => {
        const tx = window.empow.callABI("social.empow", "unfollow", [this.props.myAddress, address])
        this.action(tx, 'unfollow')
    }

    onUnfollowSuccess = () => {
        var postDetail = this.state.postDetail
        postDetail.isFollowed = false

        this.setState({
            postDetail
        })
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

    onFollowSuccess = (address) => {
        var postDetail = this.state.postDetail
        postDetail.isFollowed = true

        this.setState({
            postDetail
        })
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

        this.setState({
            postDetail: post
        })

    }

    onClickReply = (indexx) => {
        var postDetail = this.state.postDetail;
        postDetail.comment[indexx].showReply = !postDetail.comment[indexx].showReply
        this.setState({
            postDetail
        });
    }


    onSharePost = async () => {
        this.setState({
            isLoadingSharePost: true
        })

        var { sharePostInfo, statusShare } = this.state
        const tx = window.empow.callABI("social.empow", "share", [this.props.myAddress, sharePostInfo.postId, statusShare])
        this.action(tx);
    }

    upLoadPhoto = () => {
        this.refs.fileUploader.click();
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

    onClickTitle = (postId) => {
        window.location = '/post-detail/' + postId
    }

    renderSharePost() {
        var { isLoadingFollow, isLoadingSharePost } = this.state
        var value = this.state.sharePostInfo
        var accountInfoSharePost = this.state.accountInfoSharePost
        var address = value.address || {}
        var profile = accountInfoSharePost && accountInfoSharePost.profile ? accountInfoSharePost.profile : []
        var follow = 'Follow'
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
                                        <p onClick={() => this.onClickAddress(value.author)} style={{ fontWeight: 'bold', fontSize: '20px' }}>{address.selected_username ? address.selected_username : value.author.substr(0, 20) + '...'}</p>
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
                                <img src={value.content.data} style={{ width: '100%' }} alt="photos"></img>
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
        index={0}
        isLoadingFollow={this.state.isLoadingFollow}
        onClickAddress={this.onClickAddress}
        onFollow={this.onFollow}
        onClickTitle={this.onClickTitle}
        onLikePost={this.onLikePost}
        togglePopup={this.togglePopup}
        handleChangeTextComment={this.handleChangeTextComment}
        handleKeyDownComment={this.handleKeyDownComment}
        onClickReply={this.onClickReply}
        handleChangeTextReply={this.handleChangeTextReply}
        handleKeyDownReply={this.handleKeyDownReply}></Post>
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