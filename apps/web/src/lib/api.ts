import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: 'http://localhost:3000', // URL da nossa API local
});

// Adiciona o token JWT em todas as requisições se ele existir
api.interceptors.request.use((config) => {
    const token = Cookies.get('proclinic.token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
