import api from './api';
export const cadastrarDespesa = async ({ 
    user_id, moeda, valor, cidade, descricao, outro, 
    numero_recibo, missao_id, missao_name, parsedPhotos 
}, token) => {
    try {
        const formData = new FormData();

        formData.append('user_id', user_id);
        formData.append('moeda', moeda);
        formData.append('valor', valor);
        formData.append('cidade', cidade);
        formData.append('descricao', descricao);
        formData.append('outro', outro);
        formData.append('numero_recibo', numero_recibo);
        formData.append('missao_id', missao_id);
        formData.append('missao_name', missao_name);

        if (parsedPhotos && parsedPhotos.length > 0) {
            for (const uri of parsedPhotos) {
                try {
                    console.log(`Tentando carregar foto da URI: ${uri}`);
                    
                    const response = await fetch(uri);
                    const blob = await response.blob();

                    // Enviar o blob como um arquivo
                    formData.append('photos', {
                        uri,
                        name: `photo_${Date.now()}.jpg`,
                        type: blob.type || 'image/jpeg'
                    });

                    console.log(`Foto carregada com sucesso: ${uri}`);
                } catch (error) {
                    console.error(`Erro ao carregar a foto com URI ${uri}:`, error);
                }
            }
        }

        console.log('FormData antes de enviar:', formData);

        const response = await api.post('/cadastrar-despesas', formData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            transformRequest: (data, headers) => {
                return data;
            }
        });

        console.log('Resposta:', response.data);
        
    } catch (error) {
        console.error('Erro de rede:', error.response || error);
        throw error;
    }
};




export const buscarDespesas = async (token, missaoId) => {
    try {
        const response = await api.get('/buscar-despesas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { missao_id: missaoId }, // Passa o missao_id via parâmetros de consulta
        });
        return response.data.despesas; // Retorna o array de despesas
    } catch (error) {
        throw error;
    }
};




export const buscarCreditos = async (token) => {
    try {
        const response = await api.get('/buscar-moedas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.creditos; // Retorna o array de créditos
    } catch (error) {
        throw error;
    }
};
