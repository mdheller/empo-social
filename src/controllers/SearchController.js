import React, { Component } from 'react'
import Headers from '../components/Header';
import { Link } from 'react-router-dom';
import $ from "jquery"
import { API_ENDPOINT } from '../constants/index'
import { connect } from 'react-redux';

import Navbar from '../components/Navbar';
import RightNavbar from '../components/RightNavbar';
import PhotoPost from '../assets/images/Group 7449.svg'
import Avatar from '../assets/images/avatar4.svg'

class SearchController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            key: this.getKey(),
            index: 0,
            people: [
                {
                    ava: Avatar,
                    name: '今野杏南'
                },
                {
                    ava: Avatar,
                    name: '今野杏南'
                },
                {
                    ava: Avatar,
                    name: '今野杏南'
                },
            ]
        };
    };

    getKey() {
        if (this.props.match && this.props.match.params) {
            return this.props.match.params.key
        }

        return '';
    }

    renderPeople() {
        var { people } = this.state
        return (
            <ul className="people">
                {people.map((value, index) => {
                    return (
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src={value.ava} alt="photos"></img>
                                <p>{value.name}</p>
                            </div>
                            <button className="btn-general-2">Follow</button>
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderTop() {
        return (
            <div className="top">
                <p>Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!</p>
                <img src={PhotoPost} alt="photos"></img>
            </div>
        )
    }

    render() {
        var { index, key } = this.state
        return (
            <div>
                <Headers />
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    <Navbar></Navbar>
                    <div id="search">
                        <div className="waper-top">
                            <p>Kết quả tìm kiếm cho <span style={{ fontWeight: 'bold' }}>{key}</span></p>
                        </div>

                        <div className="menu">
                            <div className={index === 0 ? "child active" : "child"}>
                                <p onClick={() => this.setState({ index: 0 })}>Top</p>
                            </div>
                            <div className={index === 1 ? "child active" : "child"}>
                                <p onClick={() => this.setState({ index: 1 })}>New</p>
                            </div>
                            <div className={index === 2 ? "child active" : "child"}>
                                <p onClick={() => this.setState({ index: 2 })}>People</p>
                            </div>
                            <div className={index === 3 ? "child active" : "child"}>
                                <p onClick={() => this.setState({ index: 3 })}>Photo</p>
                            </div>
                            <div className={index === 4 ? "child active" : "child"}>
                                <p onClick={() => this.setState({ index: 4 })}>Video</p>
                            </div>
                        </div>
                        {index === 0 && this.renderTop()}
                        {index === 2 && this.renderPeople()}

                    </div>
                    <RightNavbar></RightNavbar>
                </div>
            </div>
        )


    }
}

export default connect(state => ({
}), ({
}))(SearchController)