import api from './api';

export const cadastrarDespesa = async ({ moeda, valor, cidade, descricao, outro, data_padrao, numero_recibo, missao_id }, token) => {
    try {
        const data = { moeda, valor, cidade, descricao, outro, data_padrao, numero_recibo, missao_id };

        const response = await api.post('/cadastrar-despesas', data, {
            headers: {
                Authorization: `Bearer ${token}`, 
            }
        });

        return response.data;

    } catch (error) {
        console.error('Erro ao cadastrar despesa:', error.response?.data || error);
        throw error;
    }
};




export const buscarDespesas = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-despesas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { missao_id: missao_id }, // Passa o missao_id via parâmetros de consulta
        });
        return response.data.despesas; // Retorna o array de despesas
    } catch (error) {
        throw error;
    }
};

export const buscarDespesaOne = async (token, id_despesa) => {
    try {
        const response = await api.get('/buscar-despesas-One', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { id_despesa },
        });
        return response.data.despesas;
    } catch (error) {
        throw error;
    }
};



// export const buscarCreditos = async (token, missao_id) => {
//     try {
//         // console.log(missao_id)
//         const response = await api.get('/buscar-moedas', {
//             missao_id: missao_id
//         },{ headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         });
//         return response.data.creditos; 
//     } catch (error) {
//         throw error;
//     }
// };


export const buscarCreditos = async (token, missao_id) => {
    try {
        const response = await api.get(`/buscar-moedas?missao_id=${missao_id}`, { 
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.creditos; 
    } catch (error) {
        throw error;
    }
};


// export const buscarCreditos = async (token, missao_id) => {
//     try {
//         const response = await api.get('/buscar-moedas', {
//          headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         });
//         return response.data.creditos; // Retorna o array de créditos
//     } catch (error) {
//         throw error;
//     }
// };



export const atualizarDespesa = async ({ id_despesa,  valor,  cidade, descricao,  numero_recibo,  data_padrao }, token) => {
    try {
        const response = await api.put(`/despesa/${id_despesa}`, {
             valor,  cidade, descricao,  numero_recibo,  data_padrao
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





export const createfotos = async ({ fotos, id_post }, token) => {
    try {
        const formData = new FormData();
        
        // Adicionando as fotos ao FormData
        fotos.forEach(foto => {
            formData.append('file', {
                uri: foto, 
                type: 'image/jpeg',  // Altere o tipo de acordo com a foto
                name: 'foto.jpg' // Nome para o arquivo
            });
        });

        formData.append('id_post', id_post);

        const response = await api.post('/fotos-despesas-cadastrar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        throw error;
    }
};



export const buscarImagens = async ({ id_post, token }) => {
    try {
        const response = await api.get('/buscar-imagens', {
            params: { id_post, type: 'despesa' },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        

        return response.data.imagens;  // Se 'imagens' não existir, ajuste conforme a resposta
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        throw error;
    }
};
