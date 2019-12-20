import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import $ from "jquery"
import { API_ENDPOINT } from '../constants/index'
import { connect } from 'react-redux';
import Calendar from 'react-calendar'

import HeaderAds from '../components/HeaderAds';
import Hashtag from '../assets/images/hashtag.svg'
import Download from '../assets/images/Group 7379.svg'
import Play from '../assets/images/play-button.svg'
import Click from '../assets/images/cursor.svg'
import Post from '../assets/images/Rounded.svg'
import Photos from '../assets/images/Group 680.svg'
import Search from '../assets/images/Search.svg'
import Select from 'react-select'
import Trash from '../assets/images/trash.svg'
import Edit from '../assets/images/Group 7378.svg'

class AdsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            objective: [
                {
                    img: Hashtag,
                    title: 'Hashtag',
                    content: 'Defining your own audience is optional. Twitter continuously optimizes your campaign for high performance so providing fewer targeting parameters may improve your results. '
                },
                {
                    img: Play,
                    title: 'Promoted video view',
                    content: 'Defining your own audience is optional. Twitter continuously optimizes your campaign for high performance so providing fewer targeting parameters may improve your results. '
                },
                {
                    img: Post,
                    title: 'Posts',
                    content: 'Defining your own audience is optional. Twitter continuously optimizes your campaign for high performance so providing fewer targeting parameters may improve your results. '
                },
                {
                    img: Download,
                    title: 'Install App',
                    content: 'Defining your own audience is optional. Twitter continuously optimizes your campaign for high performance so providing fewer targeting parameters may improve your results. '
                },
                {
                    img: Click,
                    title: 'Click',
                    content: 'Defining your own audience is optional. Twitter continuously optimizes your campaign for high performance so providing fewer targeting parameters may improve your results. '
                }
            ],
            content: [
                {
                    img: Photos,
                    content: 'Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!',
                    time: '14:52',
                    date: '7 thg 9, 2019'
                },
                {
                    img: Photos,
                    content: 'Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!',
                    time: '14:52',
                    date: '7 thg 9, 2019'
                },
                {
                    img: Photos,
                    content: 'Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!',
                    time: '14:52',
                    date: '7 thg 9, 2019'
                },
                {
                    img: Photos,
                    content: 'Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!',
                    time: '14:52',
                    date: '7 thg 9, 2019'
                },
                {
                    img: Photos,
                    content: 'Wow! Just amazing. I love your profile content. Look forward to see more.  Well done!',
                    time: '14:52',
                    date: '7 thg 9, 2019'
                }
            ],
            level: [
                { label: 'All member', value: 0 },
                { label: 'Cấp A', value: 1 },
                { label: 'Cấp B', value: 2 },
            ],
            menuData: [
                { label: 'All', value: 0 },
                { label: 'Language', value: 1 },
                { label: 'Location', value: 2 },
            ],
            language: [
                { name: 'English' },
                { name: 'Vietnamese' },
                { name: 'Chinese' },
            ],
            location: [
                { name: 'Ecuador' },
                { name: 'Vietnamese' },
                { name: 'Ecuador' },
            ],
            defaultLevel: { label: 'All member', value: 0 },
            defaultMenuData: { label: 'All', value: 0 },
            index: 3,
            textSearch: '',
            showCalendar: false,
            date: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            selectedLevel: [],
            selectedLanguage: [],
            selectedLocation: [],
            indexGender: 0,
            indexMenuData: 0
        };
    };

    onSearch = () => {
        const { textSearch } = this.state
        // window.location = '/search/' + textSearch
    }

    handleKeyDownSearch = (e) => {
        const { textSearch } = this.state
        if (e.key === 'Enter') {
            // window.location = '/search/' + textSearch
        }
    }

    onChangeCalendar = (date) => {
        if (this.state.indexDate === 1) {
            this.setState({
                date,
                startDate: date,
                showCalendar: false
            })
        }
        if (this.state.indexDate === 2) {
            this.setState({
                date,
                endDate: date,
                showCalendar: false
            })
        }
    }

    onClickStartDate = () => {
        this.setState({
            showCalendar: true,
            date: this.state.startDate,
            indexDate: 1
        })
    }

    onClickEndDate = () => {
        this.setState({
            showCalendar: true,
            date: this.state.endDate,
            indexDate: 2
        })
    }

    handleChangeSelectLevel = (value) => {
        var selectedLevel = this.state.selectedLevel;

        if (value.value === 0) {
            this.setState({
                selectedLevel: this.state.level.filter(x => x.value > 0)
            })
        } else {
            var exited = selectedLevel.find(x => x.value === value.value);
            if (!exited) {
                selectedLevel.push(value);
                this.setState({
                    selectedLevel
                })
            }
        }
    }

    handleChangeSelectMenuData = (value) => {
        this.setState({
            indexMenuData: value.value
        })
    }

    onAddMenuData = (value) => {
        var { indexMenuData, selectedLanguage, selectedLocation } = this.state;

        if (indexMenuData === 1) {
            var exited = selectedLanguage.find(x => x.name === value.name);
            if (!exited) {
                selectedLanguage.push(value);
                this.setState({
                    selectedLanguage
                })
            }
        }

        if (indexMenuData === 2) {
            var exited = selectedLocation.find(x => x.name === value.name);
            if (!exited) {
                selectedLocation.push(value);
                this.setState({
                    selectedLocation
                })
            }
        }
    }

    onDeleteLevel = (index) => {
        var selectedLevel = this.state.selectedLevel;
        selectedLevel.splice(index, 1);
        this.setState({
            selectedLevel
        })
    }

    onDeleteLanguage = (index) => {
        var selectedLanguage = this.state.selectedLanguage;
        selectedLanguage.splice(index, 1);
        this.setState({
            selectedLanguage
        })
    }

    onDeleteLocation = (index) => {
        var selectedLocation = this.state.selectedLocation;
        selectedLocation.splice(index, 1);
        this.setState({
            selectedLocation
        })
    }

    renderOption() {
        return (
            <div className="navbar-ads">
                <ul className="menu">
                    <p style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold' }}>EmAds</p>
                    <li onClick={() => { this.setState({ index: 0 }) }}>
                        <p>Objective</p>
                        <p></p>
                    </li>
                    <li onClick={() => { this.setState({ index: 1 }) }}>
                        <p>Content</p>
                        <p></p>
                    </li>
                    <li onClick={() => { this.setState({ index: 2 }) }}>
                        <p>Campaign</p>
                        <p></p>
                    </li>
                    <li onClick={() => { this.setState({ index: 3 }) }}>
                        <p>Audience Target</p>
                        <p></p>
                    </li>
                    <li onClick={() => { this.setState({ index: 4 }) }}>
                        <p>Review</p>
                        <p></p>
                    </li>
                </ul>
            </div>
        )
    }

    renderObjective() {
        var { objective } = this.state
        return (
            <div id="ads-objective">
                <ul>
                    {objective.map((value, index) => {
                        return (
                            <li>
                                <div className="group">
                                    <div className="child2">
                                        <img src={value.img} alt="photos"></img>
                                    </div>
                                    <div className="child">
                                        <p className="title">{value.title}</p>
                                        <p className="content">{value.content}</p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }

    renderContent() {
        var { content } = this.state
        return (
            <div id="ads">
                <div className="content">
                    <div className="group1">
                        <p>Content</p>
                        <div className="search">
                            <div className="waper-search" onClick={this.onSearch}>
                                <img src={Search} alt="photos"></img>
                            </div>
                            <input onChange={(e) => this.setState({ textSearch: e.target.value })}
                                onKeyDown={this.handleKeyDownSearch}
                                placeholder="Tìm kiếm"></input>
                        </div>
                    </div>

                    <ul>
                        {content.map((value, index) => {
                            return (
                                <li>
                                    <div>
                                        <img src={value.img} alt="photos"></img>
                                    </div>
                                    <div className="info">
                                        <p style={{ fontWeight: 'bold' }}>{value.content}</p>
                                        <div>
                                            <p>{value.time}</p>
                                            <p>{value.date}</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="right">

                </div>
            </div>
        )
    }

    renderCamp() {
        return (
            <div id="ads">
                <div className="camp">
                    <div className="group1">
                        <p>Content</p>
                    </div>
                    <div className="waper-content">
                        <div className="child">
                            <p>Name</p>
                            <input></input>
                        </div>

                        <div className="group">
                            <div className="child2">
                                <p className="title">Từ ngày</p>
                                <div>
                                    <p onClick={() => this.onClickStartDate()}>{this.state.startDate.toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="child2">
                                <p className="title">Đến ngày</p>
                                <div>
                                    <p onClick={() => this.onClickEndDate()}>{this.state.endDate.toLocaleDateString()}</p>
                                </div>
                            </div>

                            {this.state.showCalendar && <div className="calendar">
                                <Calendar
                                    onChange={this.onChangeCalendar}
                                    value={this.state.date}
                                />
                            </div>}
                        </div>

                        <div className="child">
                            <p>Total budget</p>
                            <input></input>
                        </div>

                        <div className="child">
                            <p>Bid type</p>
                            <input></input>
                        </div>

                        <div className="child">
                            <p>Bid amount</p>
                            <input></input>
                        </div>
                    </div>

                </div>

                {this.renderCampRight()}
            </div>
        )
    }

    renderCampRight() {
        return (
            <div className="right camp-right">
                <div className="group1">
                    <p>Bid type</p>
                </div>
                <div className="group2">
                    <p style={{ fontWeight: 'bold' }}>Automatic bid</p>
                    <p>Your bid will be optimized to maximize results at the lowest price (within your budget).</p>
                </div>
            </div>
        )
    }

    renderReview() {
        return (
            <div id="ads">
                <div className="review">
                    <div className="group1">
                        <p>Review</p>
                    </div>
                    <div className="waper-content">
                        <div>
                            <div className="group2">
                                <p style={{ fontWeight: 'bold' }}>Detail</p>
                                <div className="group2">
                                    <div className="group2" style={{ marginRight: '20px' }}>
                                        <img src={Trash} alt="photos"></img>
                                        <p style={{ color: '#DD3468' }}>Delete</p>
                                    </div>
                                    <div className="group2">
                                        <img src={Edit} alt="photos"></img>
                                        <p style={{ color: '#DD3468' }}>Edit</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group3">
                                <div className="child">
                                    <p>Name:</p>
                                    <span>sadsadsa</span>
                                </div>
                                <div className="child">
                                    <p>Từ ngày:</p>
                                    <span>13/10/2019</span>
                                </div>
                                <div className="child">
                                    <p>Đến ngày:</p>
                                    <span>13/10/2019</span>
                                </div>
                                <div className="child">
                                    <p>Total budget:</p>
                                    <span>1,232 EM ~ 456 USD</span>
                                </div>
                                <div className="child">
                                    <p>Bid type:</p>
                                    <span>Maximum</span>
                                </div>
                                <div className="child">
                                    <p>Bid amount:</p>
                                    <span>sadsadsa</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <div className="group2">
                                <p style={{ fontWeight: 'bold' }}>Target</p>
                            </div>

                            <div className="group3">
                                <div className="child">
                                    <p>Level:</p>
                                    <span>Cấp A, Cấp B</span>
                                </div>
                                <div className="child">
                                    <p>Gender:</p>
                                    <span>sadsadsa</span>
                                </div>
                                <div className="child">
                                    <p>Location:</p>
                                    <span>sadsadsa</span>
                                </div>
                                <div className="child">
                                    <p>Language:</p>
                                    <span>English, Vietnamese</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button className="btn-general-1">Launch campaign</button>
                    </div>

                </div>

                {this.renderReviewRight()}
            </div>
        )
    }

    renderReviewRight() {
        return (
            <div className="right review-right">
                <div className="group1">
                    <p>Bid type</p>
                </div>
                <div className="group2">
                    <p style={{ fontWeight: 'bold' }}>Automatic bid</p>
                    <p>Your bid will be optimized to maximize results at the lowest price (within your budget).</p>
                </div>
            </div>
        )
    }

    renderAudience() {
        var { selectedLevel, indexGender, indexMenuData, language, location, selectedLanguage, selectedLocation } = this.state
        var data = indexMenuData === 1 ? language : location;
        return (
            <div id="ads">
                <div className="audience">
                    <div className="group1">
                        <p>Audience Target</p>
                    </div>
                    <div className="group2">
                        <div>
                            <p className="title">Level</p>
                            <div className="select">
                                <Select className="react-select-container" classNamePrefix="react-select"
                                    isSearchable={false}
                                    options={this.state.level}
                                    value={this.state.defaultLevel}
                                    onChange={(value) => this.handleChangeSelectLevel(value)}
                                />
                            </div>
                            <ul className="list-level">
                                {selectedLevel.map((value, index) => {
                                    return (
                                        <li>
                                            <p>{value.label}</p>
                                            <div onClick={() => { this.onDeleteLevel(index) }}><p>x</p></div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div>
                            <p className="title">Gender</p>
                            <div className="waper-gender">
                                <div onClick={() => this.setState({ indexGender: 0 })}
                                    className={indexGender === 0 ? "active" : ""}>
                                    <p>Any gender</p>
                                </div>

                                <div onClick={() => this.setState({ indexGender: 1 })}
                                    className={indexGender === 1 ? "active" : ""}>
                                    <p>Male</p>
                                </div>

                                <div onClick={() => this.setState({ indexGender: 2 })}
                                    className={indexGender === 2 ? "active" : ""}>
                                    <p>Female</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <p className="title">Location, language</p>
                            <div className="group3">
                                <div className="select">
                                    <Select className="react-select-container" classNamePrefix="react-select"
                                        isSearchable={false}
                                        options={this.state.menuData}
                                        value={this.state.defaultMenuData}
                                        onChange={(value) => this.handleChangeSelectMenuData(value)}
                                    />
                                </div>
                                <div className="search">
                                    <div className="waper-search" onClick={this.onSearch}>
                                        <img src={Search} alt="photos"></img>
                                    </div>
                                    <input onChange={(e) => this.setState({ textSearch: e.target.value })}
                                        onKeyDown={this.handleKeyDownSearch}
                                        placeholder="Tìm kiếm"></input>
                                </div>
                            </div>
                            {indexMenuData > 0 && <ul className="list-menu-data">
                                {data.map((value, index) => {
                                    return (
                                        <li>
                                            <p>{value.name}</p>
                                            <p style={{ color: '#dd3468', cursor: 'pointer' }}
                                                onClick={() => this.onAddMenuData(value)}>Add</p>
                                        </li>
                                    )
                                })}
                            </ul>}
                        </div>

                        <div>
                            <p className="title">Location</p>
                            <ul className="list-level">
                                {selectedLocation.map((value, index) => {
                                    return (
                                        <li>
                                            <p>{value.name}</p>
                                            <div onClick={() => { this.onDeleteLocation(index) }}><p>x</p></div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div>
                            <p className="title">Language</p>
                            <ul className="list-level">
                                {selectedLanguage.map((value, index) => {
                                    return (
                                        <li>
                                            <p>{value.name}</p>
                                            <div onClick={() => { this.onDeleteLanguage(index) }}><p>x</p></div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                    </div>
                </div>

                {this.renderAudienceRight()}
            </div>
        )
    }

    renderAudienceRight() {
        return (
            <div className="right review-right">
                <div className="group1">
                    <p>Audience summary</p>
                </div>
                <div className="group2">
                    <p>Defining your own audience is optional. Twitter continuously optimizes your campaign for high performance so providing fewer targeting parameters may improve your results.</p>
                </div>
            </div>
        )
    }

    render() {
        var { index } = this.state
        return (
            <div>
                <HeaderAds></HeaderAds>
                <div className="container wrapper" style={{ marginTop: '20px' }}>
                    {this.renderOption()}
                    {index === 0 && this.renderObjective()}
                    {index === 1 && this.renderContent()}
                    {index === 2 && this.renderCamp()}
                    {index === 3 && this.renderAudience()}
                    {index === 4 && this.renderReview()}
                </div>
            </div>
        )


    }
}

export default connect(state => ({
}), ({
}))(AdsController)