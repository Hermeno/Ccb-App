import api from './api';
export const cadastrarDespesa = async ({  user_id, moeda, valor, cidade, descricao, outro, data_padrao, numero_recibo, missao_id, missao_name}, token) => {
    try {
        const response = await api.post('/cadastrar-despesas', {
            user_id, moeda, valor, cidade, descricao, outro, data_padrao, numero_recibo, missao_id, missao_name
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



export const buscarDespesas= async (token) => {
    try {
        const response = await api.get('/buscar-despesas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.dispesas; // Retorna apenas o array de missões
    } catch (error) {
        throw error;
    }
};