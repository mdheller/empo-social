import React, { Component } from 'react'
import { connect } from 'react-redux';
import Avatar from '../assets/images/avatar.svg'
import Photo from '../assets/images/Path 953.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import Heart from '../assets/images/Heart.svg'
import Heart2 from '../assets/images/Heart2.svg'
import Coment from '../assets/images/Path 1968.svg'
import Upload from '../assets/images/Group 613.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Utils from '../utils'
import Loading from '../assets/images/loading.svg'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import _ from 'lodash'

class Post extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoadingFollow: false,
            value: this.props.value
        }
    };

    componentDidUpdate(pre) {
        if(_.isEqual(pre, this.props)) {
            return;
        }

        this.setState({
            value: this.props.value
        })
    }

    onClickAddress = (address) => {
        window.location = '/account/' + address
    }

    onClickTitle = (postId) => {
        window.location = '/post-detail/' + postId
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

            if (actionName === "like") {
                this.onLikeSuccess()
            }

            // if (actionName === "post") {
            //     this.onPostSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[0], data);
            // }

            if (actionName === "follow") {
                this.resetContent()
                this.onFollowSuccess()
            }

            if (actionName === "unfollow") {
                this.resetContent()
                this.onUnfollowSuccess()
            }

            if (actionName === 'comment') {
                this.onCommentSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[2], data)
            }

            if (actionName === 'reply') {
                this.onReplySuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[2], data)
            }
        })
    }

    resetContent = () => {
        this.setState({
            isLoadingFollow: false
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

    onFollowSuccess = () => {
        var value = this.state.value
        value.isFollowed = true
        this.setState({
            value
        })
    }

    onUnfollow = (address) => {
        const tx = window.empow.callABI("social.empow", "unfollow", [this.props.myAddress, address])
        this.action(tx, 'unfollow')
    }

    onUnfollowSuccess = () => {
        var value = this.state.value
        value.isFollowed = false
        this.setState({
            value
        })
    }

    onLikePost = async (post) => {
        if (!this.props.myAddress) {
            return;
        }
        const tx = window.empow.callABI("social.empow", "like", [this.props.myAddress, post.postId])
        this.action(tx, 'like');
    }

    onLikeSuccess = () => {
        var value = this.state.value
        value.isLiked = true;
        value.totalLike = value.totalLike + 1

        this.setState({
            value
        })

    }

    handleChangeTextComment = (event) => {
        var value = this.state.value;
        value.commentText = event.target.value
        this.setState({
            value
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

        var value = this.state.value;
        value.comment.unshift(cmt)
        value.commentText = ''

        this.setState({
            value
        })
    }

    onClickReply = (indexx) => {
        var value = this.state.value;
        value.comment[indexx].showReply = !value.comment[indexx].showReply
        this.setState({
            value
        });
    }

    handleChangeTextReply = (event, indexx) => {
        var value = this.state.value;
        value.comment[indexx].replyText = event.target.value
        this.setState({
            value
        });
    }

    handleKeyDownReply = (e, comment, index) => {
        if (e.key === 'Enter') {
            var data = {
                postId: comment.postId,
                content: comment.replyText,
                parentId: comment.commentId.toString(),
                index: index
            }

            const tx = window.empow.callABI("social.empow", "comment", [this.props.myAddress, comment.postId, "reply", comment.commentId.toString(), comment.replyText])
            this.action(tx, 'reply', data);
        }
    }

    onReplySuccess = (commentId, obj) => {
        const reply = {
            commentId: commentId,
            postId: obj.postId,
            address: this.props.myAccountInfo,
            content: obj.content,
            parentId: obj.parentId,
            type: "reply",
            time: new Date().getTime() * 10 ** 6,
        }

        var value = this.state.value;
        
        value.comment[obj.index].replyText = ''
        value.comment.unshift(reply)

        this.setState({
            value
        })
    }

    renderPostShare(value) {
        var profile = value.postShare.addressPostShare.profile || {}
        return (
            <div>
                <p style={{ cursor: 'pointer' }} onClick={() => this.onClickTitle(value.postId)}>{value.title}</p>
                <div className="waper-content-share scroll">
                    <div className="info">
                        <div className="group">
                            <div style={{ marginRight: '10px' }} onClick={() => this.onClickAddress(value.postShare.author)} >
                                <img className="waper-ava" src={profile.avatar ? profile.avatar : Avatar} alt="photos"></img>
                            </div>
                            <div>
                                <p onClick={() => this.onClickAddress(value.postShare.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{value.postShare.addressPostShare.selected_username ? value.postShare.addressPostShare.selected_username : value.postShare.author.substr(0, 20) + '...'}</p>
                                <div className="title">
                                    <p>{Utils.convertLevel(value.postShare.addressPostShare.level)}</p>
                                    <img src={Offline} alt="photos"></img>
                                    <p>{Utils.convertDate(value.postShare.time)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content">
                        <p style={{ cursor: 'pointer' }} onClick={() => this.onClickTitle(value.postShare.postId)}>{value.postShare.title}</p>
                        <img src={value.postShare.content.data} style={{ width: '100%' }} alt="photos"></img>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        var { myAccountInfo, myAddress, isHideFollow } = this.props;
        var { isLoadingFollow, value } = this.state;
        var profile = myAccountInfo.profile || {}
        var comment = value.comment || []
        var address = value.address || {}
        var pro55 = address.profile || {}
        var follow = value.isFollowed ? 'Unfollow' : 'Follow'
        console.log(value)
        return (
            <li className="post-detail" style={{ marginBottom: '50px' }}>
                <div className="info">
                    <div className="group">
                        <div onClick={() => this.onClickAddress(value.author)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                            <img src={pro55.avatar ? pro55.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                        </div>
                        <div>
                            <p onClick={() => this.onClickAddress(value.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{address.selected_username ? address.selected_username : (value.author ? value.author.substr(0, 20) + '...' : '')}</p>
                            <div className="title">
                                <p style={{ color: '#dd3468' }}>$ {value.realLike}</p>
                                <p>{Utils.convertLevel(address.level)}</p>
                            </div>
                        </div>
                    </div>
                    {(value.author !== myAddress && !isHideFollow) && <div>
                        <button className={`btn-general-2 ${isLoadingFollow ? 'btn-loading' : ''}`} style={isLoadingFollow ? { backgroundColor: '#dd3468' } : {}} onClick={() => this.onFollow(value.author, follow)}>
                            {isLoadingFollow && <img src={Loading} alt="photos"></img>}
                            {!isLoadingFollow && <span>{follow}</span>}
                        </button>
                    </div>}
                </div>

                {value.content.type === 'share' && this.renderPostShare(value)}
                {value.content.type === 'photo' && <div className="content">
                    <p style={{ cursor: 'pointer' }} onClick={() => this.onClickTitle(value.postId)}>{value.title}</p>
                    <img src={value.content.data} alt="photos"></img>
                </div>}
                {value.content.type === 'video' && <div className="content">
                    <p style={{ cursor: 'pointer' }} onClick={() => this.onClickTitle(value.postId)}>{value.title}</p>
                    <video src={value.content.data} autoPlay></video>
                </div>}

                <div className="time">
                    <p>{Utils.convertDate(value.time)}</p>
                    <img src={Offline} alt="photos"></img>
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

                    <div onClick={() => this.props.togglePopup(value)}>
                        <img src={Upload} alt="photos"></img>
                        <p>{value.totalReport}</p>
                    </div>


                </div>

                {myAddress && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                    <div>
                        <img src={profile.avatar ? profile.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                    </div>
                    <div className="waper-cmt">
                        <input value={value.commentText}
                            placeholder="Coment"
                            onChange={(e) => this.handleChangeTextComment(e)}
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
                        var pro5 = addressComment.profile || {};
                        
                        var reply = comment.filter(x => x.type === 'reply' && x.parentId === detail.commentId.toString())
                        if (detail.type === 'reply') {
                            return <div></div>
                        }
                        return (
                            <li>
                                <div className="info">
                                    <div className="group">
                                        <div onClick={() => this.onClickAddress(addressComment.address)} className="waper-avatar" style={{ marginRight: '10px', cursor: 'pointer' }}>
                                            <img src={pro5.avatar ? pro5.avatar : Avatar} alt="photos"></img>
                                        </div>
                                        <div>
                                            <p onClick={() => this.onClickAddress(addressComment.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressComment.selected_username ? addressComment.selected_username : addressComment.address}</p>
                                            <div className="title">
                                                <p>{Utils.convertLevel(addressComment.level)}</p>
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

                                {(myAddress && detail.showReply) && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                    <div>
                                        <img src={profile.avatar ? profile.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                                    </div>
                                    <div className="waper-cmt">
                                        <input value={detail.replyText}
                                            placeholder="Coment"
                                            onChange={(e) => this.handleChangeTextReply(e, indexx)}
                                            onKeyDown={(e) => this.handleKeyDownReply(e, detail, indexx)}></input>
                                        <div>
                                            <img src={Photo} alt="photos"></img>
                                            <img src={Gif} alt="photos"></img>
                                            <img src={Icon} alt="photos"></img>
                                        </div>
                                    </div>
                                </div>}

                                {(reply && reply.length > 0) && <ul className="coment scroll">
                                    {reply.map((detailReply) => {
                                        var addressReply = detailReply.address || [];
                                        var pro5Reply = addressReply.profile || {}

                                        return (
                                            <li>
                                                <div className="info">
                                                    <div className="group">
                                                        <div onClick={() => this.onClickAddress(addressReply.address)} className="waper-avatar" style={{ marginRight: '10px', cursor: 'pointer' }}>
                                                            <img src={pro5Reply.avatar ? pro5Reply.avatar : Avatar} alt="photos"></img>
                                                        </div>
                                                        <div>
                                                            <p onClick={() => this.onClickAddress(addressReply.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressReply.selected_username ? addressReply.selected_username : addressReply.address}</p>
                                                            <div className="title">
                                                                <p>{Utils.convertLevel(addressReply.level)}</p>
                                                                <img src={Offline} alt="photos"></img>
                                                                <p>{Utils.convertDate(detailReply.time)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p style={{ marginLeft: '45px' }}>{detailReply.content}</p>
                                            </li>
                                        )
                                    })}

                                </ul>}

                            </li>
                        )
                    })}

                </ul>}

            </li>
        )
    }
};


export default connect(state => ({
    myAddress: state.app.myAddress,
    myAccountInfo: state.app.myAccountInfo,
    typeNewFeed: state.app.typeNewFeed
}), ({
}))(Post)