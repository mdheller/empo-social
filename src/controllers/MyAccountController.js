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
import Buffer from 'buffer'
import ipfsAPI from 'ipfs-http-client'
import ServerAPI from '../ServerAPI';
import { connect } from 'react-redux';
import _ from 'lodash'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class MyAccountController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            level: 'S',
            date: '30 thg 11, 2019',
            data: [],
            follow: '0',
            follower: '0',
            totalMoney: 0,
            showShare: false,
            sharePostInfo: false,
            statusShare: '',
            accountInfoSharePost: false,
            isLoadingSharePost: false,
            fileAva: false,
            fileCove: false
        };
    };

    async componentDidUpdate(pre) {
        if (_.isEqual(pre, this.props)) {
            return;
        }

        var data = await ServerAPI.getMyPost(this.props.myAddress);

        var follow = await ServerAPI.getMyFollow(this.props.myAddress);
        var follower = await ServerAPI.getMyFollower(this.props.myAddress);


        var totalMoney = 0
        data.forEach(post => {
            totalMoney += parseFloat(post.realLike)
        });

        this.setState({
            data,
            totalMoney,
            follow,
            follower
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
                isLoadingSharePost: false
            })

            Alert.error(msg[2], {
                position: 'bottom-left',
                effect: 'slide',
            });
        })

        handler.on("success", (res) => {
            console.log(res)
            console.log(actionName)

            if (!actionName) {
                this.resetContent()
            }

            if (actionName === 'comment') {
                this.onCommentSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[1], data)
            }

            if (actionName === "share") {
                this.onShareSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[0], data);
            }

            if (actionName === 'updateAva') {
                this.setState({
                    fileAva: data
                })
            }

            if (actionName === 'updateCover') {
                this.setState({
                    fileCove: data
                })
            }
        })
    }

    resetContent = () => {
        this.setState({
            sharePostInfo: false,
            statusShare: '',
            isLoadingSharePost: false,
        })
    }

    onUpdateProfile = async (index) => {
        const { myAccountInfo, myAddress } = this.props

        if (!myAccountInfo || !myAddress) {
            return;
        }

        const _self = this;
        const profile = myAccountInfo.profile || {}
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

                var info = {
                    avatar: index === 1 ? url : profile.avatar,
                    cover: index === 2 ? url : profile.cover
                }

                const tx = window.empow.callABI("social.empow", "updateProfile", [myAddress, info])
                if (index === 1) {
                    _self.action(tx, 'updateAva', url)
                }

                if (index === 2) {
                    console.log(index)
                    _self.action(tx, 'updateCover', url)
                }
            })
        }

        const photo = index === 1 ? document.getElementById("file") : document.getElementById("filee");
        reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
    }

    handleChange = (event) => {
        console.log(this.state.index)
        // if (event.target.files[0]) {
        //     this.onUpdateProfile(index);
        // }
    }

    handleChangeCover = (event) => {
        console.log("Change cover")
        console.log(this.state.index)
        // if (event.target.files[0]) {
        //     this.onUpdateProfile(index);
        // }
    }


    onLikePost = async (post) => {
        if (!this.props.myAddress) {
            return;
        }
        const tx = window.empow.callABI("social.empow", "like", [this.props.myAddress, post.postId])
        this.action(tx);
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
            totalReport: 0,
            showContent: true,
            author: this.props.myAddress,
            postShare: sharePostInfo
        }

        post.postShare.addressPostShare = post.postShare.address

        var data = this.state.data;
        data.unshift(post);
        this.setState({
            data
        })

        this.resetContent()
    }

    onClickImg = (index) => {
        this.setState({
            index
        })
        this.refs.fileUploader.click();
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

        this.resetContent()
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

    onClickTitle = (postId) => {
        window.location = '/post-detail/' + postId
    }

    upLoadPhoto = () => {
        this.refs.fileUploader.click();
    }

    renderInfo() {
        var { follow, follower, totalMoney, fileAva, fileCove } = this.state
        var { myAccountInfo, myAddress } = this.props
        var profile = myAccountInfo.profile || {}
        return (
            <div className="waper-info">
                <div className="waper-cover" onClick={() => this.onClickImg(2)}>
                    <img src={fileCove ? fileCove : (profile.cover ? profile.cover : CoverPhoto)} alt="photos"></img>
                    <input type="file" id="filee" ref="fileUploaderr" name="photo" style={{ display: "none" }} onChange={(event) => this.handleChangeCover(event, 2)} />
                </div>
                <div className="group1">
                    <div onClick={() => this.onClickImg(1)} className="avatar">
                        <img src={fileAva ? fileAva : (profile.avatar ? profile.avatar : Avatar)} alt="photos"></img>
                        <input type="file" id="file" ref="fileUploader" name="photo" style={{ display: "none" }} onChange={(event) => this.handleChange(event, 1)} />
                    </div>

                    <div className="child">
                        <img src={Mail} alt="photos"></img>
                        <img src={Fb} alt="photos"></img>
                        <img src={Noti} alt="photos"></img>
                    </div>
                </div>
                <div className="group2">
                    <span>{myAccountInfo.selected_username ? myAccountInfo.selected_username : (myAddress ? myAddress.substr(0, 20) + '...' : '')}</span>
                    <p style={{ color: '#676f75', marginLeft: '20px' }}>{Utils.convertLevel(myAccountInfo.level)}</p>
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
                        index={index}
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
                })}
            </ul>
        )
    }

    renderSharePost() {
        var { isLoadingSharePost } = this.state
        var value = this.state.sharePostInfo
        var accountInfoSharePost = this.state.accountInfoSharePost
        var address = value.address || {}
        var profile = accountInfoSharePost && accountInfoSharePost.profile ? accountInfoSharePost.profile : []
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
}))(MyAccountController)