import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria a instância
const api = axios.create({
    baseURL: 'https://api-com-nodejs-express-mongodb-prisma.onrender.com/',
    // baseURL: 'http://192.168.43.226:3000/',
});

export default api;

        // modified:   app/_layout.tsx
        // modified:   app/cambios.tsx
        // modified:   app/missao.tsx
        // modified:   app/pdf.tsx
        // modified:   app/updatecambio.tsx
        // modified:   app/updatedespesa.tsx
        // modified:   services/cambio.js
        // modified:   services/despesas.js

