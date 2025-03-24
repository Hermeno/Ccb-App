import api from './api';
export const cadastrarCambio = async ({  moeda_origem, moeda_destino, cotacao, total_a_cambiar, total_cambiado, numero_recibo,  missao_id}, token) => {
    console.log( moeda_origem, moeda_destino,
        cotacao, total_a_cambiar, total_cambiado, numero_recibo
    )
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