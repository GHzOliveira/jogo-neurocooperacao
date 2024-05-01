import axios from 'axios';

const api = axios.create({
    baseURL: 'http://35.160.120.126:3333',
});

export default api;
