import api from './api';
export const cadastrarCambio = async ({  moeda_origem, moeda_destino, cotacao, total_a_cambiar, total_cambiado, numero_recibo,  missao_id}, token) => {
    try {
        const response = await api.post('/cadastrar-cambio', {
            moeda_origem, 
            moeda_destino,
            cotacao,
            total_a_cambiar,
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
        return response;
    } catch (error) {
        // return r
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








export const buscarCambioPorId = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-cambioId', {
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



export const atualizarCambio = async (
    id,
    { moeda_origem, moeda_destino, cotacao, total_a_cambiar, total_cambiado, numero_recibo, missao_id },
    token
) => {
    try {
        const response = await api.put(`/atualizar-cambio/${id}`, {
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