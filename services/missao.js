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





export const buscarMissaoPorId = async (missao_id, token) => {
    try {
        const response = await api.get('/buscar-missaoId', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                missao_id,
            },
        });
        return response.data.missoes;
    } catch (error) {
        throw error;
    }
};

export const buscarDespesas = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-despesas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { missao_id: missao_id },
        });
        return response.data.despesas; 
    } catch (error) {
        throw error;
    }
};




export const editarMissao = async ({  missao_id, missao, estado, cidade, data_inicio_prevista, data_final_prevista, pais, username}, token) => {
    try {
        const response = await api.put(`/atualizar-missao/${missao_id}`, {
             missao, estado, cidade, data_inicio_prevista, data_final_prevista, pais, username
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response
    } catch (error) {
        throw error;
    }
}

export const buscarCambioAll = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-cambio-All', {
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


