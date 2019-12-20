import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../assets/images/avatar2.svg'
import Avatar2 from '../assets/images/21.svg'
import Offline from '../assets/images/Ellipse 311.svg'
import Coment from '../assets/images/Path 1968.svg'
import Heart from '../assets/images/Heart.svg'
import Dislike from '../assets/images/like (1).svg'
import Share from '../assets/images/Group 779.svg'
import Plus from '../assets/images/Group 7448.svg'
import Upload from '../assets/images/Group 613.svg'
import Photo from '../assets/images/Path 953.svg'
import Gif from '../assets/images/Group 601.svg'
import Icon from '../assets/images/Group 7447.svg'
import Chat from '../components/Chat'

import ServerAPI from '../ServerAPI';

class RightNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountInfo: {},
            gasPercent: 0,
            ramEMPercent: 0,
            data: [
                {
                    ava: Avatar,
                    name: '_trump01234_',
                    level: 'S',
                    time: '1',
                    likeQuantity: '1253903',
                    dislikeQuantity: '286423',
                    comentQuantity: '536376',
                    money: '592656',
                    share: '165523',
                    comentDetail: [
                        {
                            ava: Avatar2,
                            name: 'Meolanbbb',
                            level: 'S',
                            time: '1',
                            likeQuantity: '0',
                            dislikeQuantity: '0',
                            comentQuantity: '0',
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
                            money: '592656',
                            coment: 'Wow! Just amazing. I love your profile content. Look forward to see more. Well done!',
                        },
                    ]
                },
                {
                    ava: Avatar,
                    name: '_trump01234_',
                    level: 'S',
                    time: '1',
                    likeQuantity: '1253903',
                    dislikeQuantity: '286423',
                    comentQuantity: '536376',
                    money: '592656',
                    share: '165523',
                    comentDetail: [
                        {
                            ava: Avatar2,
                            name: 'Meolanbbb',
                            level: 'S',
                            time: '1',
                            likeQuantity: '0',
                            dislikeQuantity: '0',
                            comentQuantity: '0',
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
                            money: '592656',
                            coment: 'Wow! Just amazing. I love your profile content. Look forward to see more. Well done!',
                        },
                    ]
                },
                {
                    ava: Avatar,
                    name: '_trump01234_',
                    level: 'S',
                    time: '1',
                    likeQuantity: '1253903',
                    dislikeQuantity: '286423',
                    comentQuantity: '536376',
                    money: '592656',
                    share: '165523',
                    comentDetail: [
                        {
                            ava: Avatar2,
                            name: 'Meolanbbb',
                            level: 'S',
                            time: '1',
                            likeQuantity: '0',
                            dislikeQuantity: '0',
                            comentQuantity: '0',
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
                            money: '592656',
                            coment: 'Wow! Just amazing. I love your profile content. Look forward to see more. Well done!',
                        },
                    ]
                }
            ],
            suggestions: [
                {
                    ava: Avatar2,
                    name: '今野杏南'
                },
                {
                    ava: Avatar2,
                    name: '今野杏南'
                },
                {
                    ava: Avatar2,
                    name: '今野杏南'
                },
                {
                    ava: Avatar2,
                    name: '今野杏南'
                },
            ],
            showMore: false,
            showSugget: false
        }
    };



    async componentDidMount() {
        if (window.location.pathname === '/account') {
            this.setState({
                showSugget: true
            })
        }

        var address = await window.empow.enable()

        var accountInfo = await ServerAPI.getAddress(address);

        let gasPercent = (accountInfo.gas_info.limit - (accountInfo.gas_info.limit - accountInfo.gas_info.current_total)) / accountInfo.gas_info.limit * 100
        let ramEMPercent = (accountInfo.ram_info.available - accountInfo.ram_info.used) / accountInfo.ram_info.available * 100

        this.setState({
            accountInfo,
            gasPercent,
            ramEMPercent
        })
    }

    renderSugget() {
        var { suggestions, showMore } = this.state

        return (
            <ul className="suggestions">
                <p style={{ padding: '15px', fontSize: '24px', fontWeight: 'bold' }}>Suggestions</p>
                {suggestions.map((value, index) => {
                    if ((index > 2 && showMore) || index < 3) {
                        return (
                            <li>
                                <img src={value.ava} alt="photos"></img>
                                <p>{value.name}</p>
                                <button className="btn-general-2">Follow</button>
                            </li>
                        )
                    }
                })}
                {!showMore && <p style={{ padding: '20px', color: '#dd3468', cursor: 'pointer' }} onClick={() => { this.setState({ showMore: true }) }}>More</p>}
                {showMore && <p style={{ padding: '20px', color: '#dd3468', cursor: 'pointer' }} onClick={() => { this.setState({ showMore: false }) }}>Hide</p>}
            </ul>
        )
    }

    renderData() {
        return (
            <ul className="waper-data">
                {this.state.data.map((value, index) => {
                    return (
                        <li style={{ marginBottom: '50px' }}>
                            <div className="info">
                                <div className="group">
                                    <div style={{ marginRight: '10px' }}>
                                        <img src={value.ava} alt="photos"></img>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{value.name}</p>
                                        <div className="title">
                                            <p>Cấp độ: {value.level}</p>
                                            <img src={Offline} alt="photos"></img>
                                            <p>{value.time} hour</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn-general-2">Follow</button>
                                </div>
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
                            </div>

                            <div className="reaction">
                                <p style={{ color: '#dd3468' }}>$ {value.money}</p>
                                <div>
                                    <img src={Share} alt="photos"></img>
                                    <p>${value.share}</p>
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
                                                            <p>Cấp độ: {detail.level}</p>
                                                            <img src={Offline} alt="photos"></img>
                                                            <p>{detail.time} hour</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <img src={Plus} alt="photos"></img>
                                                </div>
                                            </div>

                                            <p>{detail.coment}</p>
                                            <div className="reaction">
                                                <p style={{ color: '#dd3468' }}>$ {detail.money}</p>
                                                <div>
                                                    <img src={Heart} alt="photos"></img>
                                                    <img src={Dislike} alt="photos"></img>
                                                    <img src={Coment} alt="photos"></img>
                                                    <img src={Upload} alt="photos"></img>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}

                            </ul>
                            <div className="waper-cmt">
                                <input placeholder="Coment" disabled={window.empow ? false : true}></input>
                                <div>
                                    <img src={Photo} alt="photos"></img>
                                    <img src={Gif} alt="photos"></img>
                                    <img src={Icon} alt="photos"></img>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }

    render() {
        var { accountInfo, gasPercent, ramEMPercent } = this.state
        return (
            <div className="right-navbar">
                {window.empow && <div className="waper-info">
                    <p>Balance: {accountInfo.balance} EM <span style={{ color: '#676f75', fontSize: '13px' }}>~ $0</span></p>
                    <p>Level: {accountInfo.level || 1} điểm</p>
                    <div className="group">
                        <div className="group">
                            <p>GAS</p>
                            <div className="proges">
                                <button className="percent percent-red" style={{ width: `${gasPercent}%` }}>{gasPercent.toFixed(2)}%</button>
                            </div>
                        </div>
                        <div className="group">
                            <p>RAM</p>
                            <div className="proges">
                                <button className="percent percent-red" style={{ width: `${ramEMPercent}%` }}>{ramEMPercent.toFixed(2)}%</button>
                            </div>
                        </div>
                    </div>
                </div>}
                {this.state.showSugget && this.renderSugget()}
                {this.renderData()}
                {/* <Chat></Chat> */}
            </div>
        );
    }
};

export default connect(state => ({
    // loggedIn: state.app.loggedIn,
}), ({
}))(RightNavbar)