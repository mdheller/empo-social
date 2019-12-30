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
            // myAccountInfo: {}
        };
    };

    async componentDidMount() {
        var addressAccount = this.props.match.params.address

        var accountInfo = await ServerAPI.getAddress(addressAccount)
        // var myAccountInfo = await ServerAPI.getAddress(this.props.myAddress)

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
            //  myAccountInfo
        })
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


    onFollow = (address) => {
        const tx = window.empow.callABI("social.empow", "follow", [this.props.myAddress, address])
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
        var { addressAccount, follow, follower, totalMoney } = this.state
        var { myAccountInfo } = this.props
        var profile = myAccountInfo.profile || {}
        return (
            <div className="waper-info">
                <div className="waper-cover">
                    <img src={profile.cover ? profile.cover : CoverPhoto} alt="photos"></img>
                </div>
                <div className="group1">
                    <div className="avatar">
                        <img src={Utils.testImage(profile.avatar) ? profile.avatar : Avatar} alt="photos"></img>
                    </div>

                    <div className="child">
                        <img src={Mail} alt="photos"></img>
                        <img src={Fb} alt="photos"></img>
                        <img src={Noti} alt="photos"></img>
                        <button className="btn-general-2" onClick={() => this.onFollow(addressAccount)}>Follow</button>
                    </div>
                </div>
                <div className="group2">
                    <span>{addressAccount ? addressAccount.substr(0, 20) + '...' : ''}</span>
                    <p style={{ color: '#676f75', marginLeft: '20px' }}>Cấp độ: {myAccountInfo.level || 1}</p>
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
        var { data, myAccountInfo } = this.state
        var myProfile = myAccountInfo.profile || {}

        return (
            <ul className="waper-data">
                {data.map((value, index) => {
                    var like = value.like || {};
                    var comment = value.comment || []
                    return (
                        <li style={{ marginBottom: '50px' }}>
                            <div className="content">
                                <h1>{value.title}</h1>
                                <div className="time">
                                    <p style={{ color: '#dd3468' }}>$ {like.amount}</p>
                                    <div className="time">
                                        <p>{Utils.convertDate(value.time)}</p>
                                        <img src={Offline} alt="photos"></img>
                                    </div>
                                </div>
                                <img className="waper-img" src={value.content.data} alt="photos"></img>
                            </div>

                            <div className="reaction">
                                <div>
                                    <img src={Heart} alt="photos"></img>
                                    <p>{value.totalLike}</p>
                                </div>

                                <div>
                                    <img src={Coment} alt="photos"></img>
                                    <p>{value.totalComment}</p>
                                </div>

                                <div>
                                    <img src={Upload} alt="photos"></img>
                                    <p>{value.totalReport}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                <div className="waper-avatar">
                                    <img src={Utils.testImage(myProfile.avatar) ? myProfile.avatar : Avatar3} alt="photos"></img>
                                </div>

                                <div className="waper-cmt">
                                    <input value={value.commentText}
                                        placeholder="Coment"
                                        disabled={window.empow ? false : true}
                                        onChange={(e) => this.handleChangeTextComment(e, index)}
                                        onKeyDown={(e) => this.handleKeyDownComment(e, value)}></input>
                                    <div>
                                        <img src={Photo} alt="photos"></img>
                                        <img src={Gif} alt="photos"></img>
                                        <img src={Icon} alt="photos"></img>
                                    </div>
                                </div>
                            </div>

                            <ul className="coment scroll">
                                {comment.map((detail, indexx) => {
                                    var addressComment = detail.address || [];
                                    var pro5 = addressComment.profile || {}
                                    return (
                                        <li>
                                            <div className="info">
                                                <div className="group">
                                                    <div className="waper-avatar" style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => this.onClickAddress(addressComment.address)}>
                                                        <img src={Utils.testImage(pro5.avatar) ? pro5.avatar : Avatar3} alt="photos"></img>
                                                    </div>

                                                    <div>
                                                        <p onClick={() => this.onClickAddress(addressComment.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressComment.address}</p>
                                                        <div className="title">
                                                            <p>Cấp độ: {addressComment.level}</p>
                                                            <img src={Offline} alt="photos"></img>
                                                            <p>{Utils.convertDate(detail.time)} hour</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p style={{ marginLeft: '45px' }}>{detail.content}</p>

                                            <div className="reaction">
                                                <div>
                                                    <img src={Heart} alt="photos"></img>
                                                    <p>{detail.totalReply}</p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                                <div className="waper-avatar">
                                                    <img src={Utils.testImage(myProfile.avatar) ? myProfile.avatar : Avatar3} alt="photos"></img>
                                                </div>
                                                <div className="waper-cmt">
                                                    <input value={detail.replyText}
                                                        placeholder="Coment"
                                                        disabled={window.empow ? false : true}
                                                        onChange={(e) => this.handleChangeTextReply(e, indexx, index)}
                                                        onKeyDown={(e) => this.handleKeyDownReply(e, detail)}></input>
                                                    <div>
                                                        <img src={Photo} alt="photos"></img>
                                                        <img src={Gif} alt="photos"></img>
                                                        <img src={Icon} alt="photos"></img>
                                                    </div>
                                                </div>
                                            </div>

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

    render() {
        return (
            <div>
                <Headers />
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    <Navbar></Navbar>
                    <div id="account">
                        {this.renderInfo()}
                        {this.renderPost()}
                    </div>
                    <RightNavbar></RightNavbar>
                </div>
            </div>
        )


    }
}

export default connect(state => ({
    myAddress: state.app.myAddress,
    myAccountInfo: state.app.myAccountInfo
}), ({
}))(AccountController)