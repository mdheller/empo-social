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
import Buffer from 'buffer'
import ipfsAPI from 'ipfs-http-client'
import ServerAPI from '../ServerAPI';

class AccountController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            level: 'S',
            date: '30 thg 11, 2019',
            data: [],
        };
    };

    async componentDidMount() {
        var myAddress = await window.empow.enable()
        var accountInfo = await ServerAPI.getAddress(myAddress)
        var data = await ServerAPI.getMyPost(myAddress);

        var follow = await ServerAPI.getMyFollow(myAddress);
        var follower = await ServerAPI.getMyFollower(myAddress);

        var totalMoney = 0
        data.forEach(post => {
            if (post.like && post.like.amount) {
                totalMoney += parseFloat(post.like.amount)
            }
        });

        this.setState({
            myAddress,
            accountInfo,
            data,
            totalMoney,
            follow,
            follower
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

    onUpdateProfile = async (index) => {
        const { myAddress, accountInfo } = this.state
        const _self = this;

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
                    avatar: index === 1 ? url : accountInfo.profile.avatar,
                    cover: index === 2 ? url : accountInfo.profile.cover
                }

                const tx = window.empow.callABI("social.empow", "updateProfile", [myAddress, info])
                _self.action(tx)

            })
        }

        const photo = index === 1 ? document.getElementById("file") : document.getElementById("filee");
        reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
    }


    handleChange = (event) => {
        if (event.target.files[0]) {
            this.onUpdateProfile(this.state.index);
        }
    }

    onClickImg = (index) => {
        this.setState({
            index
        })

        if (index === 1) {
            this.refs.fileUploader.click();
        } else {
            this.refs.fileUploaderr.click();
        }

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
            const tx = window.empow.callABI("social.empow", "comment", [this.state.myAddress, post.postId.toString(), "comment", "0", post.commentText])
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
            const tx = window.empow.callABI("social.empow", "comment", [this.state.myAddress, comment.postId, "reply", comment.commentId.toString(), comment.replyText])
            this.action(tx);
        }
    }

    renderInfo() {
        var { myAddress, follow, follower, accountInfo, totalMoney } = this.state
        var profile = accountInfo ? accountInfo.profile : []
        return (
            <div className="waper-info">
                <div className="waper-cover" onClick={() => this.onClickImg(2)}>
                    <img src={profile && profile.cover ? profile.cover : CoverPhoto} alt="photos"></img>
                    <input type="file" id="filee" ref="fileUploaderr" name="photo" style={{ display: "none" }} onChange={(event) => this.handleChange(event)} />
                </div>
                <div className="group1">
                    <div onClick={() => this.onClickImg(1)} className="avatar">
                        <img src={profile && profile.avatar && profile.avatar !== "" ? profile.avatar : Avatar} alt="photos"></img>
                        <input type="file" id="file" ref="fileUploader" name="photo" style={{ display: "none" }} onChange={(event) => this.handleChange(event)} />
                    </div>

                    <div className="child">
                        <img src={Mail} alt="photos"></img>
                        <img src={Fb} alt="photos"></img>
                        <img src={Noti} alt="photos"></img>
                        <button className="btn-general-2">Follow</button>
                    </div>
                </div>
                <div className="group2">
                    <span>{myAddress ? myAddress.substr(0, 20) + '...' : ''}</span>
                    <p style={{ color: '#676f75', marginLeft: '20px' }}>Cấp độ: {accountInfo ? accountInfo.level : 1}</p>
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
        var { accountInfo, data } = this.state
        var profile = accountInfo ? accountInfo.profile : []
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
                                    <img src={profile.avatar && profile.avatar !== "" ? profile.avatar : Avatar3} alt="photos"></img>
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
                                    return (
                                        <li>
                                            <div className="info">
                                                <div className="group">
                                                    <div className="waper-avatar" style={{ marginRight: '10px' }}>
                                                        <img src={addressComment.profile && addressComment.profile.avatar && addressComment.profile.avatar !== "" ? addressComment.profile.avatar : Avatar3} alt="photos"></img>
                                                    </div>

                                                    <div>
                                                        <p style={{ fontWeight: 'bold' }}>{addressComment.address}</p>
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
                                                    <img src={profile.avatar && profile.avatar !== "" ? profile.avatar : Avatar3} alt="photos"></img>
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

export default AccountController