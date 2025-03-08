import api from './api'

// export type Missao = {
//     id: number;
//     missao: string;
//     estado: string;
//     cidade: string;
//     data_inicio_prevista: string;
//     data_final_prevista: string;
//     username: string;
// };
export const cadastrarMissao =  async ({  user_id, missao, estado, cidade, data_inicio_prevista, data_final_prevista, username}, token) =>
{
        try {
        const response = await api.post('/cadastrar-missao', {
            user_id, missao, estado, cidade, data_inicio_prevista, data_final_prevista, username
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
        const response = await api.get('/buscar-missao', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.missaos; // Retorna apenas o array de missões
    } catch (error) {
        throw error;
    }
};
