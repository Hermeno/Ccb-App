import api from './api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

export const cadastrarCredito = async ({ user_id, moeda, valor, referencia, missao_id }, token) => {
    try {
        const response = await api.post(
            '/cadastrar-credito',
            { user_id, moeda, valor, referencia, missao_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const buscarCredito = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-creditos', {
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



export const buscarCreditoLimit = async (token, missao_id) => {
    try {
        const response = await api.get('/buscar-creditos-limit', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                missao_id: missao_id,
            }
        });
        return response.data.creditos; // Retorna apenas o array de missões
    } catch (error) {
        throw error;
    }
};



export const buscarRelatorioTable = async (missaoId) => {
    const token = await AsyncStorage.getItem('userToken');
    console.log("token e ", token)
    console.log("id e ", missaoId)
  try {
    const response = await api.get('/relatorioTable', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        missao_id: missaoId
      }
    });
    console.log(response.data.resultado)
    return response.data.resultado;
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    throw error;
  }
};



// export const baixarRelatorioPdf = async (missao_id) => {
//   const token = await AsyncStorage.getItem('userToken');

//   try {
//     const response = await api.get('/relatorioPdf', {
//       responseType: 'blob', // ou 'arraybuffer' se não funcionar
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: {
//         missao_id: missao_id,
//       },
//     });
//     console.log(response.data)

//     // Criar caminho temporário para salvar o arquivo PDF
//     const caminho = FileSystem.documentDirectory + 'relatorio.pdf';

//     await FileSystem.writeAsStringAsync(caminho, response.data, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     // Abrir compartilhador do sistema
    
//     await Sharing.shareAsync(caminho);

//   } catch (error) {
//     console.error('Erro ao baixar o PDF:', error);
//   }
// };


export const baixarRelatorioPdf = async (missao_id) => {
  const token = await AsyncStorage.getItem('userToken');

  try {
    const response = await api.get('/relatorioPdf', {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        missao_id,
      },
    });

    // Converter ArrayBuffer para base64
    console.log(response.data)
    const base64 = Buffer.from(response.data).toString('base64');

    const caminho = FileSystem.documentDirectory + 'relatorio.pdf';

    await FileSystem.writeAsStringAsync(caminho, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(caminho, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartilhar Relatório PDF',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Erro ao baixar o PDF:', error);
    throw error;
  }
};



export const baixarRelatorioPdfs = async (missaoId) => {
    console.log('este e id_daMissao', missaoId)
  if (!missaoId) {
    throw new Error('ID da missão é obrigatório');
  }

  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  try {
    console.log('🔄 Iniciando download do PDF para missão:', missaoId);
    
    // Gerar nome único para o arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const nomeArquivo = `relatorio_missao_${missaoId}_${timestamp}.pdf`;
    const caminho = FileSystem.documentDirectory + nomeArquivo;

    // ✨ MELHOR ABORDAGEM: Usar FileSystem.downloadAsync
    const downloadResult = await FileSystem.downloadAsync(
      `${api.defaults.baseURL}/relatorioPdf`,
    //   `${api.defaults.baseURL}/relatorioPdf?missaoId=${missaoId}`,
      caminho,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Download concluído:', downloadResult.status);
    console.log('📄 Arquivo salvo em:', downloadResult.uri);

    if (downloadResult.status !== 200) {
      throw new Error(`Erro no download: Status ${downloadResult.status}`);
    }

    // Verificar se o arquivo foi criado
    const fileInfo = await FileSystem.getInfoAsync(caminho);
    if (!fileInfo.exists) {
      throw new Error('Arquivo PDF não foi criado');
    }

    console.log('📄 Tamanho do arquivo:', fileInfo.size, 'bytes');

    console.log('📤 Compartilhando PDF...');
    
    await Sharing.shareAsync(caminho, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartilhar Relatório PDF',
      UTI: 'com.adobe.pdf',
    });

    console.log('🎉 PDF compartilhado com sucesso!');
    return { sucesso: true, caminho };

  } catch (error) {
    console.error('❌ Erro ao baixar o PDF:', {
      message: error.message,
      stack: error.stack,
    });

    if (error.message.includes('Status 404')) {
      throw new Error('Rota do relatório não encontrada. Verifique a URL da API.');
    } else if (error.message.includes('Status 401')) {
      throw new Error('Token inválido. Faça login novamente.');
    } else if (error.message.includes('Status 500')) {
      throw new Error('Erro interno do servidor ao gerar PDF.');
    } else if (error.message.includes('Network request failed')) {
      throw new Error('Erro de conexão. Verifique sua internet.');
    } else {
      throw new Error(`Erro ao gerar PDF: ${error.message}`);
    }
  }
};