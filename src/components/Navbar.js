import React, { Component } from 'react'
import { connect } from 'react-redux';
import ServerAPI from '../ServerAPI';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trend: [],
            showNoti: false
        }
    };

    async componentDidMount() {
        if (window.location.pathname === '/account') {
            this.setState({
                showNoti: true
            })
        }

        var trend = await ServerAPI.getTagTrending();

        this.setState({
            trend
        })
    }

    renderNoti() {
        return (
            <div className="waper-noti">
                <p style={{fontWeight: 'bold'}}>Notification</p>
                <p>Bạn đã follow người thứ 51, bạn có muốn hủy follow … không?</p>
                <div className="waper-button">
                    <button className="btn-general-1 btn1">Cancel</button>
                    <button className="btn-general-2 btn2">Accpet</button>
                </div>
            </div>
        )
    }


    render() {
        var { trend, showMore, showNoti } = this.state
        return (
            <div className="navbar">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn-general-1 btn1">Image</button>
                    <button className="btn-general-2 btn2">Video</button>
                </div>
                <ul className="menu">
                    <p style={{ padding: '15px', fontSize: '24px', fontWeight: 'bold' }}>Trend</p>
                    {trend.map((value, index) => {
                        if ((index > 2 && showMore) || index < 3) {
                            return (
                                <li>
                                    <p>{value.tag}</p>
                                    <p>{value.like} like</p>
                                </li>
                            )
                        }
                    })}
                    {!showMore && <p style={{ padding: '20px', color: '#dd3468', cursor: 'pointer' }} onClick={() => { this.setState({ showMore: true }) }}>More</p>}
                    {showMore && <p style={{ padding: '20px', color: '#dd3468', cursor: 'pointer' }} onClick={() => { this.setState({ showMore: false }) }}>Hide</p>}
                </ul>

                <ul className="menu">
                    <p style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold' }}>Display</p>
                    <li>
                        <p>Quảng cáo</p>
                        <p></p>
                    </li>
                    <li>
                        <p>Ngôn ngữ</p>
                        <p></p>
                    </li>
                    <li>
                        <p>Vị trí</p>
                        <p></p>
                    </li>
                    <li>
                        <p>Mọi người</p>
                        <p></p>
                    </li>
                    <li>
                        <p>Nội dung</p>
                        <p></p>
                    </li>
                </ul>

                {showNoti && this.renderNoti()}
            </div>
        );
    }
};

export default connect(state => ({
    // loggedIn: state.app.loggedIn,
}), ({
}))(Navbar)