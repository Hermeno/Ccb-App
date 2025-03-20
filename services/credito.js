import api from './api';

export const cadastrarCredito = async ({ user_id, moeda, valor, referencia }, token) => {
    try {
        const response = await api.post(
            '/cadastrar-credito',
            { user_id, moeda, valor, referencia },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response)
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const buscarCredito = async (token) => {
    try {
        const response = await api.get('/buscar-creditos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.creditos; // Retorna apenas o array de missões
    } catch (error) {
        throw error;
    }
};




export const buscarCreditoLimit = async (token) => {
    try {
        const response = await api.get('/buscar-creditos-limit', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.creditos; // Retorna apenas o array de missões
    } catch (error) {
        throw error;
    }
};
