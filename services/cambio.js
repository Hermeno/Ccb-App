import api from './api';
export const cadastrarCambio = async ({  moeda_origem, moeda_destino, cotacao, total_a_cambiar, total_cambiado, numero_recibo}, token) => {
    console.log( moeda_origem, moeda_destino,
        cotacao, total_a_cambiar, total_cambiado, numero_recibo
    )
    console.log(token)
    try {
        const response = await api.post('/cadastrar-cambio', {
            moeda_origem, 
            moeda_destino,
            cotacao,
            total_a_cambiar,
            total_cambiado,
            numero_recibo,
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




export default function CambioComponent() {
    return null;  // Isso faz o arquivo ter um `export default`, mas é gambiarra
}