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

export const buscarMissoesAll = async (token) => {
    try {
        const response = await api.get('/buscar-missoes-All', {
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


export const buscarDespesasAll = async (token, missao_id) => {
    console.log(token, missao_id)
    try {
        const response = await api.get('/buscar-despesas-All', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { missao_id: missao_id },
        });
        console.log(response.data)
        return response.data.despesas; 
    } catch (error) {
        throw error;
    }
};


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
        return response.data.cambios;
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



export const terminarMissao = async (token, missaoId, status) => {
    try {
        const response = await api.put(`/missao/${missaoId}`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar missão:', error);
        throw error;
    }
};