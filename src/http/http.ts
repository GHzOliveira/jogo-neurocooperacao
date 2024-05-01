import axios from 'axios';

const api = axios.create({
    baseURL: 'https://neurocooperacao-backend.onrender.com',
});

export default api;
