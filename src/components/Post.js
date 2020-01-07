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
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class Post extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    };

    renderPostShare(value) {
        var profile = value.postShare.addressPostShare.profile || {}
        return (
            <div>
                <p style={{ cursor: 'pointer' }} onClick={() => this.props.onClickTitle(value.postId)}>{value.title}</p>
                <div className="waper-content-share scroll">
                    <div className="info">
                        <div className="group">
                            <div style={{ marginRight: '10px' }} onClick={() => this.props.onClickAddress(value.postShare.author)} >
                                <img className="waper-ava" src={profile.avatar ? profile.avatar : Avatar} alt="photos"></img>
                            </div>
                            <div>
                                <p onClick={() => this.props.onClickAddress(value.postShare.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{value.postShare.addressPostShare.selected_username ? value.postShare.addressPostShare.selected_username : value.postShare.author.substr(0, 20) + '...'}</p>
                                <div className="title">
                                    <p>{Utils.convertLevel(value.postShare.addressPostShare.level)}</p>
                                    <img src={Offline} alt="photos"></img>
                                    <p>{Utils.convertDate(value.postShare.time)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content">
                        <p style={{ cursor: 'pointer' }} onClick={() => this.props.onClickTitle(value.postShare.postId)}>{value.postShare.title}</p>
                        <img src={value.postShare.content.data} style={{ width: '100%' }} alt="photos"></img>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        var { myAccountInfo, myAddress, value, index, isLoadingFollow } = this.props;
        var profile = myAccountInfo.profile || {}

        var comment = value.comment || []
        var address = value.address || {}
        var pro55 = address.profile || {}
        var follow = value.isFollowed ? 'Unfollow' : 'Follow'
        return (
            <li className="post-detail" style={{ marginBottom: '50px' }}>
                <div className="info">
                    <div className="group">
                        <div onClick={() => this.props.onClickAddress(value.author)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                            <img src={pro55.avatar ? pro55.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                        </div>
                        <div>
                            <p onClick={() => this.props.onClickAddress(value.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{address.selected_username ? address.selected_username : (value.author ? value.author.substr(0, 20) + '...' : '')}</p>
                            <div className="title">
                                <p style={{ color: '#dd3468' }}>$ {value.realLike}</p>
                                <p>{Utils.convertLevel(address.level)}</p>
                            </div>
                        </div>
                    </div>
                    {value.author !== myAddress && <div>
                        <button className={`btn-general-2 ${isLoadingFollow ? 'btn-loading' : ''}`} style={isLoadingFollow ? { backgroundColor: '#dd3468' } : {}} onClick={() => this.props.onFollow(value.author, follow)}>
                            {isLoadingFollow && <img src={Loading} alt="photos"></img>}
                            {!isLoadingFollow && <span>{follow}</span>}
                        </button>
                    </div>}
                </div>

                {value.content.type === 'share' && this.renderPostShare(value)}
                {value.content.type === 'photo' && <div className="content">
                    <p style={{ cursor: 'pointer' }} onClick={() => this.props.onClickTitle(value.postId)}>{value.title}</p>
                    <img src={value.content.data} alt="photos"></img>
                </div>}

                <div className="time">
                    <p>{Utils.convertDate(value.time)}</p>
                    <img src={Offline} alt="photos"></img>
                </div>

                <div className="reaction">
                    {!value.isLiked && <div onClick={() => this.props.onLikePost(value)}>
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
                            onChange={(e) => this.props.handleChangeTextComment(e, index)}
                            onKeyDown={(e) => this.props.handleKeyDownComment(e, value)}></input>
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
                                        <div onClick={() => this.props.onClickAddress(addressComment.address)} className="waper-avatar" style={{ marginRight: '10px', cursor: 'pointer' }}>
                                            <img src={pro5.avatar ? pro5.avatar : Avatar} alt="photos"></img>
                                        </div>
                                        <div>
                                            <p onClick={() => this.props.onClickAddress(addressComment.address)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>{addressComment.selected_username ? addressComment.selected_username : addressComment.address}</p>
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
                                    <p onClick={() => this.props.onClickReply(index, indexx)} style={{ cursor: 'pointer' }}>Reply</p>
                                </div>

                                {(myAddress && detail.showReply) && <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                    <div>
                                        <img src={profile.avatar ? profile.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                                    </div>
                                    <div className="waper-cmt">
                                        <input value={detail.replyText}
                                            placeholder="Coment"
                                            onChange={(e) => this.props.handleChangeTextReply(e, indexx, index)}
                                            onKeyDown={(e) => this.props.handleKeyDownReply(e, detail)}></input>
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
    }
};


export default connect(state => ({
    myAddress: state.app.myAddress,
    myAccountInfo: state.app.myAccountInfo,
    typeNewFeed: state.app.typeNewFeed
}), ({
}))(Post)