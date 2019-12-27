import React, { Component } from 'react'
import Headers from '../components/Header';

import Navbar from '../components/Navbar';
import RightNavbar from '../components/RightNavbar';
import ServerAPI from '../ServerAPI';
import Utils from '../utils'

class SearchController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            key: this.getKey(),
            index: 0,
            posts: [],
            addresses: [],
            postsOfTag: []
        };
    };

    async componentDidMount() {
        var { key } = this.state

        if (!key || key === "" || key === null) {
            return;
        }

        var addresses = await ServerAPI.getAddressByKey(key)
        var posts = await ServerAPI.getPostByKey(key)
        var postsOfTag = await ServerAPI.getPostByTag(key)

        this.setState({
            addresses,
            posts,
            postsOfTag
        })
    }

    getKey() {
        if (this.props.match && this.props.match.params) {
            return this.props.match.params.key
        }

        return '';
    }

    renderPeople() {
        var { addresses } = this.state
        return (
            <ul className="people">
                {addresses.map((value, index) => {
                    return (
                        <li>
                            <div className="content">
                                <p>{value.address.substr(0, 20) + '...'}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderPost() {
        var { posts } = this.state
        return (
            <ul className="people">
                {posts.map((value, index) => {
                    return (
                        <li>
                            <div className="content">
                                <p>{value.author.substr(0, 20) + '...'}</p>
                                <p style={{ color: '#676f75', fontSize: '16px', fontWeight: 'normal' }}>{Utils.convertDate(value.time)}</p>
                                <p>{value.title}</p>
                                <img src={value.content.data} alt="photos"></img>
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderTag() {
        var { postsOfTag } = this.state
        return (
            <ul className="people">
                {postsOfTag.map((value, index) => {
                    return (
                        <li>
                            <div className="content">
                                <p>{value.author.substr(0, 20) + '...'}</p>
                                <p style={{ color: '#676f75', fontSize: '16px', fontWeight: 'normal' }}>{Utils.convertDate(value.time)}</p>
                                <p>{value.title}</p>
                                <img src={value.content.data} alt="photos"></img>
                            </div>
                        </li>
                    )
                })}
            </ul>
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
                                <p onClick={() => this.setState({ index: 0 })}>People</p>
                            </div>
                            <div className={index === 1 ? "child active" : "child"}>
                                <p onClick={() => this.setState({ index: 1 })}>Post</p>
                            </div>
                            <div className={index === 2 ? "child active" : "child"}>
                                <p onClick={() => this.setState({ index: 2 })}>Tag</p>
                            </div>
                        </div>
                        {index === 0 && this.renderPeople()}
                        {index === 1 && this.renderPost()}
                        {index === 2 && this.renderTag()}

                    </div>
                    <RightNavbar></RightNavbar>
                </div>
            </div>
        )


    }
}

export default SearchController