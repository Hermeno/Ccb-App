import api from './api';
export const cadastrarCambio = async ({  moeda_origem, moeda_destino, data_padrao,  cotacao, total_a_cambiar, total_cambiado, numero_recibo,  missao_id}, token) => {
    try {
        const response = await api.post('/cadastrar-cambio', {
            moeda_origem, 
            moeda_destino,
            cotacao,
            total_a_cambiar,
            data_padrao,
            total_cambiado,
            numero_recibo,
            missao_id
        },    
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }   
    );
        // return response.message;
        console.log('Resposta do backend:', response.data);
        return response;
    } catch (error) {
        // return r
        throw error;
    }

}


export const createfotos = async ({ fotos, id_post, missaofoto, datafoto, missaoId }, token) => {
    try {
        const formData = new FormData();

        // Adicionando as fotos ao FormData
        fotos.forEach((foto, index) => {
            formData.append('file', {
                uri: foto, 
                type: 'image/jpeg', // ou detecte o tipo real
                name: `foto_${index}.jpg` // nome único para cada
            });
        });

        // Adicionando os outros campos de texto
        formData.append('id_post', id_post);
        formData.append('missaofoto', missaofoto);
        formData.append('datafoto', datafoto);
        formData.append('missaoId', missaoId);

        const response = await api.post('/fotos-cambio', formData, {
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






export const buscarCambioPorId = async (idCambio, token, missao_id) => {
    try {
        const response = await api.get('/buscar-cambioById', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                missao_id: missao_id,
                idCambio: idCambio
            }
        });
        return response.data.cambio;
    } catch (error) {
        throw error;
    }
};

export const buscarCabiosOneByOne = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-cambios-one-by-one', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                missao_id: missao_id,
            }
        });
        return response.data.cambios; // Certifique-se de que a chave é 'cambios' no retorno da API
    } catch (error) {
        throw error;
    }
};



export const atualizarCambio = async ({idCambio, moeda_origem, moeda_destino, cotacao, total_a_cambiar, total_cambiado, numero_recibo, missao_id },
    token
) => {
    try {
        const response = await api.put(`/atualizar-cambio`, {
            idCambio,
            moeda_origem,
            moeda_destino,
            cotacao,
            total_a_cambiar,
            total_cambiado,
            numero_recibo,
            missao_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};













export default function CambioComponent() {
    return null;  // Isso faz o arquivo ter um `export default`, mas é gambiarra
}