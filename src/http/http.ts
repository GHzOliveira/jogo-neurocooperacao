import axios from 'axios';

const api = axios.create({
    baseURL: 'https://neurocoop-backend-2225c4ca4682.herokuapp.com',
});

export default api;
