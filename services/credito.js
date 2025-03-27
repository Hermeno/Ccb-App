import api from './api';

export const cadastrarCredito = async ({ user_id, moeda, valor, referencia, missao_id }, token) => {
    try {
        const response = await api.post(
            '/cadastrar-credito',
            { user_id, moeda, valor, referencia, missao_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const buscarCredito = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-creditos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                missao_id: missao_id,
            }
        });
        return response.data.creditos;
    } catch (error) {
        throw error;
    }
};



export const buscarCreditoLimit = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-creditos-limit', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                missao_id: missao_id,
            }
        });
        return response.data.creditos; // Retorna apenas o array de missões
    } catch (error) {
        throw error;
    }
};
