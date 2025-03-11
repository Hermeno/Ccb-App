import api from './api'
export const cadastrarMissao =  async ({  user_id, missao, estado, cidade, data_inicio_prevista, data_final_prevista, pais, username}, token) =>
{
        try {
        const response = await api.post('/cadastrar-missao', {
            user_id, missao, estado, cidade, data_inicio_prevista, data_final_prevista, pais, username
        },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
     })
        return response
    } catch (error) {
        throw error;
    }
}



export const buscarMissoes = async (token) => {
    try {
        const response = await api.get('/buscar-missoes', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log(response.data.missaos)
        return response.data.missoes; // Retorna apenas o array de missões
    } catch (error) {
        throw error;
    }
};
