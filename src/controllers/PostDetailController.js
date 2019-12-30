import React, { Component } from 'react'
import Headers from '../components/Header';

import Navbar from '../components/Navbar';
import RightNavbar from '../components/RightNavbar';
import ServerAPI from '../ServerAPI';
import Utils from '../utils'

import Avatar from '../assets/images/avatar.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Heart from '../assets/images/Heart.svg'
import Coment from '../assets/images/Path 1968.svg'
import Upload from '../assets/images/Group 613.svg'
import Photo from '../assets/images/Path 953.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'

import { connect } from 'react-redux';

class PostDetailController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            postId: this.getPostId(),
            textComment: '',
            showError: false,
            showSuccess: false,
            postDetail: {}
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
                showError: error.toString()
            })
        })

        handler.on("success", (res) => {
            console.log(res)
            this.resetContent()
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

    renderPostDetail() {
        var { postDetail } = this.state
        var { myAccountInfo } = this.props;

        var profile = myAccountInfo.profile || {}
        var like = postDetail.like || {};
        var comment = postDetail.comment || []
        var address = postDetail.address || {}

        return (
            <div className="post-detail">
                <div className="info">
                    <div className="group">
                        <div onClick={() => this.onClickAddress(postDetail.author)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                            <img src={Avatar} alt="photos"></img>
                        </div>
                        <div>
                            <p onClick={() => this.onClickAddress(postDetail.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{postDetail && postDetail.author ? postDetail.author.substr(0, 20) + '...' : ''}</p>
                            <div className="title">
                                <p style={{ color: '#dd3468' }}>$ {like.amount}</p>
                                <p>Cấp độ: {address.level}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="btn-general-2">Follow</button>
                    </div>
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
                    <div onClick={() => this.onLikePost(postDetail)}>
                        <img src={Heart} alt="photos"></img>
                        <p>{postDetail.totalLike}</p>
                    </div>

                    <div>
                        <img src={Coment} alt="photos"></img>
                        <p>{postDetail.totalComment}</p>
                    </div>

                    <div onClick={() => this.togglePopup(postDetail)}>
                        <img src={Upload} alt="photos"></img>
                        <p>{postDetail.totalReport}</p>
                    </div>


                </div>

                <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                    <div>
                        <img src={Utils.testImage(profile.avatar) ? profile.avatar : Avatar} alt="photos"></img>
                    </div>
                    <div className="waper-cmt">
                        <input value={postDetail.commentText}
                            placeholder="Coment"
                            disabled={window.empow ? false : true}
                            onChange={(e) => this.handleChangeTextComment(e)}
                            onKeyDown={(e) => this.handleKeyDownComment(e)}></input>
                        <div>
                            <img src={Photo} alt="photos"></img>
                            <img src={Gif} alt="photos"></img>
                            <img src={Icon} alt="photos"></img>
                        </div>
                    </div>
                </div>
                <div className="coment scroll">
                    {comment.map((detail, indexx) => {
                        var addressComment = detail.address || [];
                        var pro5 = addressComment.profile || {}
                        return (
                            <li>
                                <div className="info">
                                    <div className="group">
                                        <div onClick={() => this.onClickAddress(addressComment.address)} className="waper-avatar" style={{ marginRight: '10px', cursor: 'pointer' }}>
                                            <img src={Utils.testImage(pro5.avatar) ? pro5.avatar : Avatar} alt="photos"></img>
                                        </div>
                                        <div>
                                            <p onClick={() => this.onClickAddress(addressComment.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressComment.address}</p>
                                            <div className="title">
                                                <p>Cấp độ: {addressComment.level}</p>
                                                <img src={Offline} alt="photos"></img>
                                                <p>{Utils.convertDate(detail.time)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ marginLeft: '45px' }}>{detail.content}</p>

                                <div className="reaction">
                                    <div>
                                        <img src={Coment} alt="photos"></img>
                                        <p>{detail.totalReply}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                    <div>
                                        <img src={Avatar} alt="photos"></img>
                                    </div>
                                    <div className="waper-cmt">
                                        <input value={detail.replyText}
                                            placeholder="Coment"
                                            disabled={window.empow ? false : true}
                                            onChange={(e) => this.handleChangeTextReply(e, indexx)}
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
                </div>
            </div>
        )
    }

    renderError() {
        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => { this.setState({ showError: false }) }}></div>
                    <div className="error">
                        <p>{this.state.showError}</p>
                    </div>
                </div>
            </div>
        )
    }

    renderSuccess() {
        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range" onClick={() => { this.setState({ showSuccess: false }) }}></div>
                    <div className="error">
                        <p>{this.state.showSuccess}</p>
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
                    <div id="post-detail">
                        {this.renderPostDetail()}
                        {this.state.showError && this.renderError()}
                        {this.state.showSuccess && this.renderSuccess()}
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
}))(PostDetailController)