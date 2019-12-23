import Axios from "axios";
import { API_ENDPOINT } from './constants/index'

const ServerAPI = {
    getAddress(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getAddress/${address}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getNewFeed(page = 1, pageSize = 20) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getNewFeed?page=${page}&pageSize=${pageSize}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getCountry() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`https://geolocation-db.com/json/`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getMyPost(address, page = 1, pageSize = 20) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getMyPost/${address}?page=${page}&pageSize=${pageSize}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getMyFollow(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getMyFollow/${address}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getMyFollower(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getMyFollower/${address}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
}

export default ServerAPI;
