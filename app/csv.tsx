import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'; // Importando o módulo para compartilhamento
import { useJwt } from './jwt';
import { buscarCambioAll, buscarDespesasAll } from '../services/missao';

export default function CsvScreen() {
    const user = useJwt();
    const [cambio, setCambio] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const { missao_id, missao_name } = useLocalSearchParams();   
 
    
  const [missaoId, setMissaoId] = useState<string | null>(null);
  const [missaoName, setMissaoName] = useState('');  
  useEffect(() => {
     const fetchMissao = async () => {
       const missao_id = await AsyncStorage.getItem('missao_id');
       const missao_name = await AsyncStorage.getItem('missao_name');         
       if (missao_id) {
         setMissaoId(missao_id);
       }
       if (missao_name) {
         setMissaoName(missao_name);
       }
     };   
     fetchMissao();
   }, []);  



    useEffect(() => {
        const carregarCambios = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarCambioAll(token, missao_id);  
                setCambio(data || []);
            } catch (error) {
                console.error('Erro ao buscar câmbios:', error);
            }
        };

        const carregarDespesas = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarDespesasAll(token, missao_id); 
                setDespesas(data || []);
            } catch (error) {
                console.error('Erro ao buscar despesas:', error);
            }
        };

        carregarCambios();
        carregarDespesas();
    }, []);

    const exportarCSV = async () => {
        try {
            let csvContent = `Missão: ${missaoName}\n\n`;

            // ➡️ Adicionando os dados de câmbio
            csvContent += `Dados de Câmbio:\n`;
            csvContent += `Moeda Origem,Moeda Destino,Cotação,Total a Cambiar,Total Cambiado,Número Recibo\n`;
            cambio.forEach((item) => {
                csvContent += `${item.moeda_origem || ''},${item.moeda_destino || ''},${item.cotacao || ''},${item.total_a_cambiar || ''},${item.total_cambiado || ''},${item.numero_recibo || ''}\n`;
            });

            csvContent += `\nDados de Despesas:\n`;
            csvContent += `Moeda,Valor,Cidade,Descrição,Data,Numero Recibo\n`;
            despesas.forEach((item) => {
                csvContent += `${item.moeda || ''},${item.valor || ''},${item.cidade || ''},${item.descricao || ''},${item.data_padrao || ''},${item.numero_recibo || ''}\n`;
            });

            const fileUri = `${FileSystem.documentDirectory}relatorio.csv`;
            await FileSystem.writeAsStringAsync(fileUri, csvContent, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            const canShare = await Sharing.isAvailableAsync();

            if (canShare) {
                // Compartilhar o arquivo gerado
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv', // Definir o tipo MIME adequado para o CSV
                    dialogTitle: 'Compartilhar Relatório de Missão',
                });
            } else {
                Alert.alert('Erro', 'O compartilhamento de arquivos não está disponível neste dispositivo.');
            }

        } catch (error) {
            console.error('Erro ao salvar CSV:', error);
            Alert.alert('Erro', `Falha ao salvar o arquivo CSV. Erro: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Exportar Relatório</Text>
            <TouchableOpacity style={styles.button} onPress={exportarCSV}>
                <Text style={styles.buttonText}>Compartilhar CSV</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
