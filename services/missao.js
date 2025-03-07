import api from './api'


export const cadastrarMissao =  async ({  user_id, missao, estado, cidade, data_inicio_prevista, data_final_prevista, username}, token) =>
{

    // console.log(missao, estado, cidade, data_inicio_prevista, data_final_prevista, user_id,  token)
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
        console.error(error,'Missao falhou')
        throw error;
    }
}