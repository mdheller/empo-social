import React, { Component } from 'react'
import Headers from '../components/Header';
import LogoTron from '../assets/images/logo-tron.svg'
import LogoEthereum from '../assets/images/logo-ethereum.svg'
import LogoEos from '../assets/images/logo-eos.svg'
import LogoIost from '../assets/images/logo-iost.svg'
import ServerAPI from '../ServerAPI';
import LoadingIcon from '../assets/images/loading.svg'
import { Link } from 'react-router-dom';
import $ from "jquery"
import { API_ENDPOINT } from '../constants/index'
import { connect } from 'react-redux';
import Search from '../components/Search';
import Navbar from '../components/Navbar';
import RightNavbar from '../components/RightNavbar';
import Avatar from '../assets/images/avatar-big.svg'
import Mail from '../assets/images/Group 7451.svg'
import Fb from '../assets/images/Group 7450.svg'
import Noti from '../assets/images/Group 704.svg'
import CoverPhoto from '../assets/images/Rectangle 3121.svg'
import Calendar from '../assets/images/Group 676.svg'
import Avatar1 from '../assets/images/avatar2.svg'
import Avatar2 from '../assets/images/21.svg'
import PhotoPost from '../assets/images/Group 7449.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Heart from '../assets/images/Heart.svg'
import Dislike from '../assets/images/like (1).svg'
import Coment from '../assets/images/Path 1968.svg'
import Upload from '../assets/images/Group 613.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import Photo from '../assets/images/Path 953.svg'
import Avatar3 from '../assets/images/avatar.svg'

class AccountController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '@anhndp01234',
            level: 'S',
            money: 592656,
            date: '30 thg 11, 2019',
            follow: 8,
            follower: 112634,
            data: [
                {
                    ava: Avatar1,
                    name: '_trump01234_',
                    level: 'S',
                    likeQuantity: '1253903',
                    dislikeQuantity: '286423',
                    comentQuantity: '536376',
                    money: '592656',
                    share: '165523',
                    content: 'Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!',
                    date: '7 thg 9, 2019',
                    time: '14:52',
                    image: PhotoPost,
                    comentDetail: [
                        {
                            ava: Avatar2,
                            name: 'Meolanbbb',
                            level: 'S',
                            time: '1',
                            likeQuantity: '0',
                            dislikeQuantity: '0',
                            comentQuantity: '0',
                            share: '165523',
                            money: '592656',
                            coment: 'Wow! Just amazing. I love your profile content. Look forward to see more. Well done!',
                        },
                        {
                            ava: Avatar2,
                            name: 'Meolanbbb',
                            level: 'S',
                            time: '1',
                            likeQuantity: '0',
                            dislikeQuantity: '0',
                            comentQuantity: '0',
                            share: '165523',
                            money: '592656',
                            coment: 'Wow! Just amazing. I love your profile content. Look forward to see more. Well done!',
                        },
                    ]
                },
                {
                    ava: Avatar1,
                    name: '_trump01234_',
                    level: 'S',
                    likeQuantity: '1253903',
                    dislikeQuantity: '286423',
                    comentQuantity: '536376',
                    money: '592656',
                    share: '165523',
                    content: 'Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!',
                    date: '7 thg 9, 2019',
                    time: '14:52',
                    image: PhotoPost,
                    comentDetail: [
                        {
                            ava: Avatar2,
                            name: 'Meolanbbb',
                            level: 'S',
                            time: '1',
                            likeQuantity: '0',
                            dislikeQuantity: '0',
                            comentQuantity: '0',
                            share: '165523',
                            money: '592656',
                            coment: 'Wow! Just amazing. I love your profile content. Look forward to see more. Well done!',
                        },
                        {
                            ava: Avatar2,
                            name: 'Meolanbbb',
                            level: 'S',
                            time: '1',
                            likeQuantity: '0',
                            dislikeQuantity: '0',
                            comentQuantity: '0',
                            share: '165523',
                            money: '592656',
                            coment: 'Wow! Just amazing. I love your profile content. Look forward to see more. Well done!',
                        },
                    ]
                },
            ]
        };
    };

    renderInfo() {
        var { name, level, money, date, follow, follower } = this.state
        return (
            <div className="waper-info">
                <div>
                    <img src={CoverPhoto} alt="photos"></img>
                </div>
                <div className="group1">
                    <div className="avatar">
                        <img src={Avatar} alt="photos"></img>
                    </div>
                    <div className="child">
                        <img src={Mail} alt="photos"></img>
                        <img src={Fb} alt="photos"></img>
                        <img src={Noti} alt="photos"></img>
                        <button className="btn-general-2">Follow</button>
                    </div>
                </div>
                <div className="group2">
                    <span>{name}</span>
                    <p style={{ color: '#676f75', marginLeft: '20px' }}>Cấp độ: {level}</p>
                </div>
                <div className="group2">
                    <p style={{ color: '#dd3468' }}>$ {money}</p>
                    <img src={Calendar} alt="photos"></img>
                    <p>Đã tham gia từ {date}</p>
                </div>
                <div className="group2">
                    <p><span>{follow}</span> follow</p>
                    <p><span>{follower}</span> follower</p>
                </div>
            </div>
        )
    }

    renderPost() {
        return (
            <ul className="waper-data">
                {this.state.data.map((value, index) => {
                    return (
                        <li style={{ marginBottom: '50px' }}>
                            <div className="content">
                                <h1>{value.content}</h1>
                                <div className="time">
                                    <p style={{ color: '#dd3468' }}>$ {value.money}</p>
                                    <div className="time">
                                        <p>{value.time}</p>
                                        <img src={Offline} alt="photos"></img>
                                        <p>{value.date}</p>
                                    </div>
                                </div>
                                <img src={value.image} alt="photos"></img>
                            </div>

                            <div className="reaction">
                                <div>
                                    <img src={Heart} alt="photos"></img>
                                    <p>{value.likeQuantity}</p>
                                </div>

                                <div>
                                    <img src={Dislike} alt="photos"></img>
                                    <p>{value.dislikeQuantity}</p>
                                </div>

                                <div>
                                    <img src={Coment} alt="photos"></img>
                                    <p>{value.comentQuantity}</p>
                                </div>

                                <div>
                                    <img src={Upload} alt="photos"></img>
                                    <p>{value.share}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px' }}>
                                <div>
                                    <img src={Avatar3} alt="photos"></img>
                                </div>
                                <div className="waper-cmt">
                                    <input placeholder="Coment"></input>
                                    <div>
                                        <img src={Photo} alt="photos"></img>
                                        <img src={Gif} alt="photos"></img>
                                        <img src={Icon} alt="photos"></img>
                                    </div>
                                </div>
                            </div>

                            <ul className="coment scroll">
                                {value.comentDetail.map((detail, indexx) => {
                                    return (
                                        <li>
                                            <div className="info">
                                                <div className="group">
                                                    <div style={{ marginRight: '10px' }}>
                                                        <img src={detail.ava} alt="photos"></img>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold' }}>{detail.name}</p>
                                                        <div className="title">
                                                            <p style={{ color: '#dd3468', marginRight: '20px' }}>$ {detail.money}</p>
                                                            <p>Cấp độ: {detail.level}</p>
                                                            <img src={Offline} alt="photos"></img>
                                                            <p>{detail.time} hour</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p style={{ marginLeft: '45px' }}>{detail.coment}</p>

                                            <div className="reaction">
                                                <div>
                                                    <img src={Heart} alt="photos"></img>
                                                    <p>{detail.likeQuantity}</p>
                                                </div>

                                                <div>
                                                    <img src={Dislike} alt="photos"></img>
                                                    <p>{detail.dislikeQuantity}</p>
                                                </div>

                                                <div>
                                                    <img src={Coment} alt="photos"></img>
                                                    <p>{detail.comentQuantity}</p>
                                                </div>

                                                <div>
                                                    <img src={Upload} alt="photos"></img>
                                                    <p>{detail.share}</p>
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
}), ({
}))(AccountController)