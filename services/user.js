import api from './api'; // api.js terá a configuração do axios com baseURL

export const  cadastrarUsuario = async ({ name, email, cargo, comum, celular, password }) => {
    try {
        const response = await api.post('/cadastro', {
            name: name,
            email: email,
            cargo: cargo,
            comum: comum,
            celular: celular,
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




// select user by id with token
export const getUserById = async (id, token) => {
    try {
        const response = await api.get(`/listar-usuario/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return response.data.user; // Retorna apenas os dados do usuário
        }
        throw new Error('Falha ao buscar o usuário');
    } catch (error) {
        throw error;
    }
};


// update user by id
export const updateUserById = async (id, { name, email, cargo, comum, celular }, token) => {
    try {
        const response = await api.put(`/atualizar-usuario/${id}`, {    
            name,
            email,
            cargo,  
            comum,
            celular
        },
            { 
                headers: { 
                    Authorization: `Bearer ${token}`, 
                } 
            }
    );
        if (response.status === 200) {
            return response.data.user; // Retorna apenas os dados do usuário atualizado
        }
        throw new Error('Falha ao atualizar o usuário');
    } catch (error) {
        throw error;
    }
};

export default function DummyComponent() {
    return null;  // Isso faz o arquivo ter um `export default`, mas é gambiarra
}