import Axios from "axios";
import { API_ENDPOINT } from './constants/index'

const ServerAPI = {
    getAddress(address) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getAddress/${address}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getNewFeed(myAddress, typeNewFeed = 'trending', page = 1, pageSize = 20) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getNewFeed?page=${page}&pageSize=${pageSize}&address=${myAddress}&type=${typeNewFeed}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getCountry() {
        return new Promise((resolve, reject) => {
            Axios.get(`https://geolocation-db.com/json/`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getMyPost(address, myAddress, page = 1, pageSize = 20) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getMyPost/${address}/${myAddress}?page=${page}&pageSize=${pageSize}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getMyFollow(address) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getMyFollow/${address}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getMyFollower(address) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getMyFollower/${address}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getAddressByKey(key, page = 1, pageSize = 20) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getAddressByKey/${key}?page=${page}&pageSize=${pageSize}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getPostByKey(key, page = 1, pageSize = 20) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getPostByKey/${key}?page=${page}&pageSize=${pageSize}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getPostByTag(tag, page = 1, pageSize = 20) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getPostByTag/${tag}?page=${page}&pageSize=${pageSize}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getTagTrending(limit = 10) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getTagTrending?limit=${limit}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getNotification(address, page = 1, pageSize = 20) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getNotification/${address}?page=${page}&pageSize=${pageSize}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getPostDetailByPostId(postId, myAddress) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getPostDetailByPostId/${postId}?address=${myAddress}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    getPostRightNavbar() {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/getPostRightNavbar`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },

    checkFollowed(address, target) {
        return new Promise((resolve, reject) => {
            Axios.get(`${API_ENDPOINT}/checkFollowed/${address}/${target}`)
                .then(res => (resolve(res.data)))
                .catch(error => (reject(error.response.data)))
        })
    },
}

export default ServerAPI;
