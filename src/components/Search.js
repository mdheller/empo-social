import React, { Component } from 'react'
import { connect } from 'react-redux';
import Select from 'react-select'
import IconSearch from '../assets/images/icon-search.svg'

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                { label: 'ETHEREUM', value: 1 }
            ],
            defaultValue: { label: 'ETHEREUM', value: 1 },
            addressFilter: '',
        }
    };

    handleChangeSelect = (value) => {
        this.setState({
            defaultValue: value
        })
    }

    
    handleKeyDownFilter = (e) => {

        const { addressFilter } = this.state

        if (e.key === 'Enter') {
            // check address or tx
            if (addressFilter.length === 42) {
                window.location = '/ethereum/address/' + addressFilter
            } else {
                window.location = '/ethereum/tx/' + addressFilter
            }
        }
    }

    onSearch = () => {
        const { addressFilter } = this.state
        // // check address or tx
        if (addressFilter.length === 42) {
            window.location = '/ethereum/address/' + addressFilter
        } else {
            window.location = '/ethereum/tx/' + addressFilter
        }
    }

    render() {
        return (
            <div className="filter">
                <p>EMPOW Blockchain Explorer</p>
                <div className="waper">
                    <div className="select">
                        <Select className="react-select-container" classNamePrefix="react-select"
                            isSearchable={false}
                            options={this.state.data}
                            value={this.state.defaultValue}
                            onChange={(value) => this.handleChangeSelect(value)}
                        />
                    </div>
                    <input placeholder="Search by Address / Block / Token"
                        onChange={(e) => this.setState({ addressFilter: e.target.value })}
                        onKeyDown={this.handleKeyDownFilter}></input>
                    <button className="group-search" onClick={this.onSearch}><img src={IconSearch} alt="photos"></img></button>
                </div>
            </div>
        )
    }
};

export default connect(state => ({
}), ({
}))(Search)