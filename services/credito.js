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

        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
