import axios from 'axios';

const api = axios.create({
    baseURL:
        'https://neurocooperacao-backend-8o0wti1lu-ghzoliveiras-projects.vercel.app',
});

export default api;
