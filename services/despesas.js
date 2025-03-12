import api from './api';
export const cadastrarDespesa = async ({  user_id, valor, cidade, descricao, outro, data_padrao, numero_recibo}, token) => {
    try {
        const response = await api.post('/cadastrar-despesa', {
            user_id, valor, cidade, descricao, outro, data_padrao, numero_recibo
        },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
     })
    } catch (error) {
        console.log(error);
        throw error;
    }
}