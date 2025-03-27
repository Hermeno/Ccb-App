import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria a instância
const api = axios.create({
    // baseURL: 'https://api-node-js-8v1k.onrender.com/',
    baseURL: 'http://192.168.43.226:3000/',
});

// Adiciona o token a cada requisição automaticamente
// api.interceptors.request.use(async (config) => {
//     const token = await AsyncStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default api;
