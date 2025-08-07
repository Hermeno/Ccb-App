import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria a instância
const api = axios.create({
    // baseURL: 'https://api-com-nodejs-express-mongodb-prisma.onrender.com/',
    baseURL: 'http://192.168.43.226:3000/',
});

export default api;
