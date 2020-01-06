import React, { Component, useState } from 'react'
import Headers from '../components/Header';
import Navbar from '../components/Navbar';
import Avatar from '../assets/images/avatar.svg'
import Photo from '../assets/images/Path 953.svg'
import Chart from '../assets/images/Group 599.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import RightNavbar from '../components/RightNavbar';
import Heart from '../assets/images/Heart.svg'
import Heart2 from '../assets/images/Heart2.svg'
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
import tagsInput from 'tags-input'
import $ from "jquery";
import { connect } from 'react-redux';
import Loading from '../assets/images/loading.svg'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

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
            accountInfoSharePost: false,
            isLoadingPost: false,
            isLoadingSharePost: false,
            isLoadingFollow: false
        };
    };

    componentDidMount() {
        if (!this.props.myAddress) {
            var handle = setInterval(this.getData, 1000);
            this.setState({
                handle
            })
            return
        }

        this.getData()

    }

    getData = async () => {
        if (!this.props.myAddress) {
            return;
        }

        clearInterval(this.state.handle)

        var data = await ServerAPI.getNewFeed(this.props.myAddress);
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

    onClickReply = (index, indexx) => {
        var data = this.state.data;
        data[index].comment[indexx].showReply = !data[index].comment[indexx].showReply
        this.setState({
            data
        });
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

    handleKeyDownReply = (e, comment) => {
        if (e.key === 'Enter') {
            const tx = window.empow.callABI("social.empow", "comment", [this.props.myAddress, comment.postId, "reply", comment.commentId.toString(), comment.replyText])
            this.action(tx);
        }
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
                this.onLikeSuccess(data)
            }

            if (actionName === "post") {
                this.onPostSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[0], data);
            }

            if (actionName === "follow") {
                this.resetContent()
                this.onFollowSuccess(data)
            }

            if (actionName === "unfollow") {
                this.resetContent()
                this.onUnfollowSuccess(data)
            }

            if (actionName === 'comment') {
                this.onCommentSuccess(JSON.parse(res.transaction.tx_receipt.receipts[0].content)[1], data)
            }
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

    onPostStatus = async () => {
        this.setState({
            isLoadingPost: true
        })

        const { status, country } = this.state
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
                    type: "photo",
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
            totalReport: 0,
            showContent: true,
            author: this.props.myAddress
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

    onClickAddress = (address) => {
        window.location = '/account/' + address
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
        this.action(tx, 'follow', address)
    }

    onFollowSuccess = (address) => {
        var data = this.state.data
        for (let i = 0; i < data.length; i++) {
            if (data[i].author === address) {
                data[i].isFollowed = true
            }
        }

        this.setState({
            data
        })
    }

    onUnfollow = (address) => {
        const tx = window.empow.callABI("social.empow", "unfollow", [this.props.myAddress, address])
        this.action(tx, 'unfollow', address)
    }

    onUnfollowSuccess = (address) => {
        var data = this.state.data
        for (let i = 0; i < data.length; i++) {
            if (data[i].author === address) {
                data[i].isFollowed = false
            }
        }

        this.setState({
            data
        })
    }

    onClickTitle = (postId) => {
        window.location = '/post-detail/' + postId
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
                <img style={{ marginRight: '10px' }} src={this.state.file} alt="photos"></img>
            </div>
        )
    }

    renderSharePost() {
        var { isLoadingSharePost, isLoadingFollow } = this.state
        var value = this.state.sharePostInfo
        var accountInfoSharePost = this.state.accountInfoSharePost
        var address = value.address || {}
        var profile = accountInfoSharePost && accountInfoSharePost.profile ? accountInfoSharePost.profile : []
        var follow = value.isFollowed ? 'Unfollow' : 'Follow'
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

    renderPost() {
        var { myAccountInfo, myAddress } = this.props;
        var { isLoadingFollow } = this.state
        var profile = myAccountInfo.profile || {}

        return (
            <ul>
                {this.state.data.map((value, index) => {
                    var comment = value.comment || []
                    var address = value.address || {}
                    var pro55 = address.profile || {}
                    var follow = value.isFollowed ? 'Unfollow' : 'Follow'
                    return (
                        <li className="post-detail" style={{ marginBottom: '50px' }}>
                            <div className="info">
                                <div className="group">
                                    <div onClick={() => this.onClickAddress(value.author)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                                        <img src={pro55.avatar ? pro55.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                                    </div>
                                    <div>
                                        <p onClick={() => this.onClickAddress(value.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{address.selected_username ? address.selected_username : value.author.substr(0, 20) + '...'}</p>
                                        <div className="title">
                                            <p style={{ color: '#dd3468' }}>$ {value.realLike}</p>
                                            <p>{Utils.convertLevel(address.level)}</p>
                                        </div>
                                    </div>
                                </div>
                                {value.author !== myAddress && <div>
                                    <button className={`btn-general-2 ${isLoadingFollow ? 'btn-loading' : ''}`} style={isLoadingFollow ? { backgroundColor: '#dd3468' } : {}} onClick={() => this.onFollow(value.author, follow)}>
                                        {isLoadingFollow && <img src={Loading} alt="photos"></img>}
                                        {!isLoadingFollow && <span>{follow}</span>}
                                    </button>
                                </div>}
                            </div>

                            <div className="content">
                                <p style={{ cursor: 'pointer' }} onClick={() => this.onClickTitle(value.postId)}>{value.title}</p>
                                <img src={value.content.data} alt="photos"></img>
                            </div>

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

                                <div onClick={() => this.togglePopup(value)}>
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
                                                <p onClick={() => this.onClickReply(index, indexx)} style={{ cursor: 'pointer' }}>Reply</p>
                                            </div>

                                            {(myAddress && detail.showReply) && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                                <div>
                                                    <img src={profile.avatar ? profile.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
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

    render() {
        return (
            <div>
                <Headers />
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    <Navbar></Navbar>
                    <div id="home">
                        {this.props.myAddress && this.renderStatus()}
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
}))(HomeController)