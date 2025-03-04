import api from './api'; // api.js terá a configuração do axios com baseURL
export const cadastrarCambio = async ({}) => {
    try {
        const response = await api.post('/cambios', {
            moeda_origem: moeda_origem,
            moeda_destino: moeda_destino,
            cotacao: cotacao,
            total_a_cambiar: total_a_cambiar,
            total_cambiado: total_cambiado,
            numero_recibo: numero_recibo,
            foto_recibo: foto_recibo,
            user_id: user_id,
            username: username,
            data_cambio: new Date()
        });
        return response.data;
    } catch (error) {
        throw error;
    }

}
