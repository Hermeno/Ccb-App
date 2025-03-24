import api from './api';

export const cadastrarDespesa = async ({ moeda, valor, cidade, descricao, outro, data_padrao, numero_recibo, missao_id }, token) => {
    console.log(
        moeda, valor, cidade, descricao, outro, data_padrao, numero_recibo, missao_id
    )
    try {
        const data = { moeda, valor, cidade, descricao, outro, data_padrao, numero_recibo, missao_id };

        const response = await api.post('/cadastrar-despesas', data, {
            headers: {
                Authorization: `Bearer ${token}`, 
            }
        });

        console.log('Despesa cadastrada com sucesso:', response.data.dispesas);
        return response.data.dispesas; // ✅ Corrigido para acessar response.data

    } catch (error) {
        console.error('Erro ao cadastrar despesa:', error.response?.data || error);
        throw error;
    }
};




export const buscarDespesas = async (token, missaoId) => {
    try {
        const response = await api.get('/buscar-despesas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { missao_id: missaoId }, // Passa o missao_id via parâmetros de consulta
        });
        return response.data.despesas; // Retorna o array de despesas
    } catch (error) {
        throw error;
    }
};




export const buscarCreditos = async (token) => {
    try {
        const response = await api.get('/buscar-moedas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.creditos; // Retorna o array de créditos
    } catch (error) {
        throw error;
    }
};
