import api from './api'; // api.js terá a configuração do axios com baseURL

export const cadastrarUsuario = async ({ name, user, email, password }) => {
    try {
        const response = await api.post('/cadastro', {
            name: name,
            username: user,
            email: email,
            password: password,
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const loginUsuario = async ({ email, password }) => {
    try {
        const response = await api.post('/login', {
            email: email,
            password: password,
        });
        if (response.status === 200) {
            const token = response.data;
            return token;
        }
    } catch (error) {
        console.error('Erro no login', error);
        throw error;
    }
};