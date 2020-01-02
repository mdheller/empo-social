import React, { Component } from 'react'
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
import { connect } from 'react-redux';
import Utils from '../utils'

class RightNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gasPercent: 0,
            ramEMPercent: 0,
            data: [],
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



    async componentDidUpdate(pre) {
        if (pre.myAddress === this.props.myAddress && pre.myAccountInfo === this.props.myAccountInfo) {
            return;
        }

        if (window.location.pathname === '/my-account') {
            this.setState({
                showSugget: true
            })
        }

        var accountInfo = this.props.myAccountInfo

        if (!accountInfo) {
            return;
        }

        var data = await ServerAPI.getPostRightNavbar()

        let gasPercent = accountInfo.gas_info.current_total / accountInfo.gas_info.limit * 100
        let ramEMPercent = accountInfo.ram_info.available / accountInfo.ram_info.total * 100

        this.setState({
            gasPercent,
            ramEMPercent,
            data
        })


    }

    onFollow = (address) => {
        const tx = window.empow.callABI("social.empow", "follow", [this.props.myAddress, address])
        this.action(tx)
    }

    onClickAddress = (address) => {
        window.location = '/account/' + address
    }

    onClickTitle = (postId) => {
        window.location = '/post-detail/' + postId
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
                    var address = value.address || {}
                    var pro55 = address.profile || {}
                    return (
                        <li style={{ marginBottom: '50px' }}>
                            <div className="info">
                                <div className="group">
                                    <div style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => this.onClickAddress(value.author)}>
                                        <img src={pro55.avatar ? pro55.avatar : Avatar} alt="photos" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></img>
                                    </div>
                                    <div>
                                        <p onClick={() => this.onClickAddress(value.author)} style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>{value.author.substr(0, 15) + '...'}</p>
                                        <div className="title">
                                            <p>Level: {Utils.convertLevel(value.level)}</p>
                                            <img src={Offline} alt="photos"></img>
                                            <p>{Utils.convertDate(value.time)} hour</p>
                                        </div>
                                    </div>
                                </div>

                                {value.author !== this.props.myAddress && <div>
                                    <button className="btn-general-2" onClick={() => this.onFollow(value.author)}>{Utils.renderFollow(value.author, this.props.listFollow)}</button>
                                </div>}
                            </div>

                            <div className="content">
                                <p style={{ cursor: 'pointer' }} onClick={() => this.onClickTitle(value.postId)}>{value.title}</p>
                                <img src={value.content.data} alt="photos" style={{ width: '100%' }}></img>
                            </div>

                            <div className="reaction">
                                <p style={{ color: '#dd3468' }}>$ {value.realLike}</p>

                                <div>
                                    <img src={Heart} alt="photos"></img>
                                    <p>{value.totalLike}</p>
                                </div>

                                <div>
                                    <img src={Coment} alt="photos"></img>
                                    <p>{value.totalComment}</p>
                                </div>

                                <div>
                                    <img src={Share} alt="photos"></img>
                                    <p>{value.totalReport}</p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }

    render() {
        var { gasPercent, ramEMPercent } = this.state
        var accountInfo = this.props.myAccountInfo || {}

        return (
            <div className="right-navbar">
                {window.empow && <div className="waper-info">
                    <p>Balance: {accountInfo.balance} EM <span style={{ color: '#676f75', fontSize: '13px' }}>~ $0</span></p>
                    <p>Level: {Utils.convertLevel(accountInfo.level)}</p>
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
    myAddress: state.app.myAddress,
    myAccountInfo: state.app.myAccountInfo,
    listFollow: state.app.listFollow
}), ({
}))(RightNavbar)