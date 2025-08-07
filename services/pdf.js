import api from './api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';


export const buscarRelatorioPdf = async (missaoId) => {
  const token = await AsyncStorage.getItem('userToken');
  try {
    const response = await api.get('/relatorioPdf', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        missao_id: missaoId
      }
    });
    return response.data.resultado; // retorna array com os dados de cada câmbio
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    throw error;
  }
};
