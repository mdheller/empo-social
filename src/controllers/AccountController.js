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
import Coment from '../assets/images/Path 1968.svg'
import Upload from '../assets/images/Group 613.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import Photo from '../assets/images/Path 953.svg'
import Avatar3 from '../assets/images/avatar.svg'

import Chart from '../assets/images/Group 599.svg'
import Elip from '../assets/images/Ellipse 318.svg'
import Plus from '../assets/images/Group 605.svg'
import Delete from '../assets/images/Union 28.svg'
import EmojiPicker from 'emoji-picker-react';

import Utils from '../utils'
import ServerAPI from '../ServerAPI';
import { connect } from 'react-redux';

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
            accountInfoSharePost: false
        };
    };

    async componentDidMount() {
        var addressAccount = this.props.match.params.address

        var accountInfo = await ServerAPI.getAddress(addressAccount)

        var data = await ServerAPI.getMyPost(addressAccount);

        var follow = await ServerAPI.getMyFollow(addressAccount);
        var follower = await ServerAPI.getMyFollower(addressAccount);

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

    action = (tx) => {
        tx.addApprove("*", "unlimited")

        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            console.log(error)
            this.setState({
                showError: error.toString()
            })
        })

        handler.on("success", (res) => {
            console.log(res)
            this.setState({
                showSuccess: res.toString()
            })
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
        this.action(tx);
    }

    upLoadPhoto = () => {
        this.refs.fileUploader.click();
    }

    onSharePost = async () => {
        var { sharePostInfo, statusShare } = this.state
        const tx = window.empow.callABI("social.empow", "share", [this.props.myAddress, sharePostInfo.postId, statusShare])
        this.action(tx);
    }

    onFollow = (address, follow) => {
        if (follow === 'Unfollow') {
            this.onUnfollow(address)
            return;
        }
        const tx = window.empow.callABI("social.empow", "follow", [this.props.myAddress, address])
        this.action(tx)
    }

    onUnfollow = (address) => {
        const tx = window.empow.callABI("social.empow", "unfollow", [this.props.myAddress, address])
        this.action(tx)
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
            const tx = window.empow.callABI("social.empow", "comment", [this.props.myAddress, post.postId.toString(), "comment", "0", post.commentText])
            this.action(tx);
        }
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
        var { addressAccount, follow, follower, totalMoney, accountInfo } = this.state
        var profile = accountInfo.profile || {}
        var follow = Utils.renderFollow(addressAccount, this.props.listFollow)
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
                            <button className="btn-general-2" onClick={() => this.onFollow(addressAccount, follow)}>{follow}</button>
                        </div>}
                    </div>
                </div>
                <div className="group2">
                    <span>{addressAccount ? addressAccount.substr(0, 20) + '...' : ''}</span>
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

                            <ul className="coment scroll">
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
                                                        <p onClick={() => this.onClickAddress(addressComment.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressComment.address}</p>
                                                        <div className="title">
                                                            <p>Level: {Utils.convertLevel(addressComment.level)}</p>
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

                            </ul>

                        </li>
                    )
                })}
            </ul>
        )
    }

    renderSharePost() {
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
                            <p>Repost lại thông tin này</p>
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
                                    <button className="btn-general-2" onClick={() => this.onFollow(value.author, follow)}>{follow}</button>
                                </div>}
                            </div>

                            <div className="content">
                                <p>{value.title}</p>
                                <img src={value.content.data} alt="photos"></img>
                            </div>
                        </div>
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
                                <button className="btn-general-1" onClick={() => this.onSharePost()}>Post</button>
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
    listFollow: state.app.listFollow
}), ({
}))(AccountController)