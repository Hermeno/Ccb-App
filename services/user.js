import api from './api'; // api.js terá a configuração do axios com baseURL

export const  cadastrarUsuario = async ({ name, user, email, password }) => {
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
        if (response.status === 200) { // Confirme se o token está aqui
            return response.data;
        } else {
            throw new Error('Falha no login');
        }
    } catch (error) {
        // console.error('Erro no login:', error.message);
        throw error;
    }
};


export default function DummyComponent() {
    return null;  // Isso faz o arquivo ter um `export default`, mas é gambiarra
}