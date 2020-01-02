import React, { Component } from 'react'
import Headers from '../components/Header';

import Navbar from '../components/Navbar';
import RightNavbar from '../components/RightNavbar';
import ServerAPI from '../ServerAPI';
import Utils from '../utils'

import Avatar from '../assets/images/avatar.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Heart from '../assets/images/Heart.svg'
import Heart2 from '../assets/images/Heart2.svg'
import Coment from '../assets/images/Path 1968.svg'
import Upload from '../assets/images/Group 613.svg'
import Photo from '../assets/images/Path 953.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'

import Chart from '../assets/images/Group 599.svg'
import Elip from '../assets/images/Ellipse 318.svg'
import Plus from '../assets/images/Group 605.svg'
import Delete from '../assets/images/Union 28.svg'
import EmojiPicker from 'emoji-picker-react';
import Loading from '../assets/images/loading.svg'
import { connect } from 'react-redux';

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

        var postDetail = await ServerAPI.getPostDetailByPostId(postId)
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
            this.action(tx);
        }
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

    action = (tx) => {
        tx.addApprove("*", "unlimited")

        const handler = window.empow.signAndSend(tx)

        // handler.on("pending", (hash) => {
        //     addAlert("warning", `transaction on pending: ${hash}`)
        // })

        handler.on("failed", (error) => {
            console.log(error)
            this.setState({
                isLoadingSharePost: false,
                isLoadingFollow: false
            })
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
    onClickAddress = (address) => {
        window.location = '/account/' + address
    }

    onUnfollow = (address) => {
        const tx = window.empow.callABI("social.empow", "unfollow", [this.props.myAddress, address])
        this.action(tx)
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
        this.action(tx)
    }

    onLikePost = async (post) => {
        if (!this.props.myAddress) {
            return;
        }
        const tx = window.empow.callABI("social.empow", "like", [this.props.myAddress, post.postId])
        this.action(tx);
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

    renderSharePost() {
        var { isLoadingFollow, isLoadingSharePost } = this.state
        var value = this.state.sharePostInfo
        var accountInfoSharePost = this.state.accountInfoSharePost
        var address = value.address || {}
        var profile = accountInfoSharePost && accountInfoSharePost.profile ? accountInfoSharePost.profile : []
        var follow = Utils.renderFollow(value.author, this.props.listFollow)
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
                                        <p onClick={() => this.onClickAddress(value.author)} style={{ fontWeight: 'bold', fontSize: '20px' }}>{value.author.substr(0, 20) + '...'}</p>
                                        <div className="title">
                                            <p>Level: {Utils.convertLevel(address.level)}</p>
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
                                <img src={value.content.data} style={{width: '100%'}} alt="photos"></img>
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

    renderPostDetail() {
        var { postDetail, isLoadingFollow } = this.state
        var { myAccountInfo } = this.props;

        var profile = myAccountInfo.profile || {}
        var comment = postDetail.comment || []
        var address = postDetail.address || {}
        var pro5 = address.profile || {}
        var follow = Utils.renderFollow(postDetail.author, this.props.listFollow)
        var isLiked = Utils.isLikedPost(postDetail.postId, this.props.listPostLiked)
        return (
            <div className="post-detail">
                <div className="info">
                    <div className="group">
                        <div onClick={() => this.onClickAddress(postDetail.author)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                            <img src={pro5.avatar ? pro5.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                        </div>
                        <div>
                            <p onClick={() => this.onClickAddress(postDetail.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{postDetail && postDetail.author ? postDetail.author.substr(0, 20) + '...' : ''}</p>
                            <div className="title">
                                <p style={{ color: '#dd3468' }}>$ {postDetail.realLike}</p>
                                <p>Level: {Utils.convertLevel(address.level)}</p>
                            </div>
                        </div>
                    </div>

                    {(this.props.myAddress && postDetail.author !== this.props.myAddress) && <div>
                        <button className={`btn-general-2 ${isLoadingFollow ? 'btn-loading' : ''}`} style={isLoadingFollow ? { backgroundColor: '#dd3468' } : {}} onClick={() => this.onFollow(postDetail.author, follow)}>
                            {isLoadingFollow && <img src={Loading} alt="photos"></img>}
                            {!isLoadingFollow && <span>{follow}</span>}
                        </button>
                    </div>}
                </div>

                <div className="content">
                    <p>{postDetail.title}</p>
                    <img src={postDetail && postDetail.content ? postDetail.content.data : ''} alt="photos"></img>
                </div>

                <div className="time">
                    <p>{Utils.convertDate(postDetail.time)}</p>
                    <img src={Offline} alt="photos"></img>
                </div>

                <div className="reaction">
                    {!isLiked && <div onClick={() => this.onLikePost(postDetail)}>
                        <img src={Heart} alt="photos"></img>
                        <p>{postDetail.totalLike}</p>
                    </div>}

                    {isLiked && <div>
                        <img src={Heart2} alt="photos"></img>
                        <p>{postDetail.totalLike}</p>
                    </div>}

                    <div>
                        <img src={Coment} alt="photos"></img>
                        <p>{postDetail.totalComment}</p>
                    </div>

                    <div onClick={() => this.togglePopup(postDetail)}>
                        <img src={Upload} alt="photos"></img>
                        <p>{postDetail.totalReport}</p>
                    </div>


                </div>

                {this.props.myAddress && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                    <div>
                        <img src={profile.avatar ? profile.avatar : Avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="photos"></img>
                    </div>
                    <div className="waper-cmt">
                        <input value={postDetail.commentText}
                            placeholder="Coment"
                            onChange={(e) => this.handleChangeTextComment(e)}
                            onKeyDown={(e) => this.handleKeyDownComment(e)}></input>
                        <div>
                            <img src={Photo} alt="photos"></img>
                            <img src={Gif} alt="photos"></img>
                            <img src={Icon} alt="photos"></img>
                        </div>
                    </div>
                </div>}
                <div className="coment scroll">
                    {comment.map((detail, indexx) => {
                        var addressComment = detail.address || [];
                        var pro5 = addressComment.profile || {}
                        return (
                            <li>
                                <div className="info">
                                    <div className="group">
                                        <div onClick={() => this.onClickAddress(addressComment.address)} className="waper-avatar" style={{ marginRight: '10px', cursor: 'pointer' }}>
                                            <img src={pro5.avatar ? pro5.avatar : Avatar} alt="photos"></img>
                                        </div>
                                        <div>
                                            <p onClick={() => this.onClickAddress(addressComment.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressComment.address}</p>
                                            <div className="title">
                                                <p>Level: {Utils.convertLevel(addressComment.level)}</p>
                                                <img src={Offline} alt="photos"></img>
                                                <p>{Utils.convertDate(detail.time)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ marginLeft: '45px' }}>{detail.content}</p>

                                <div className="reaction">
                                    <p onClick={() => this.onClickReply(indexx)} style={{ cursor: 'pointer' }}>Reply</p>
                                </div>

                                {(this.props.myAddress && detail.showReply) && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                    <div>
                                        <img src={profile.avatar ? profile.avatar : Avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="photos"></img>
                                    </div>
                                    <div className="waper-cmt">
                                        <input value={detail.replyText}
                                            placeholder="Coment"
                                            onChange={(e) => this.handleChangeTextReply(e, indexx)}
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
                    <div id="post-detail">
                        {this.renderPostDetail()}
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
    listFollow: state.app.listFollow,
    listPostLiked: state.app.listPostLiked
}), ({
}))(PostDetailController)