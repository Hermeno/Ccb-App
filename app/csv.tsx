import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useJwt } from './jwt';
import { buscarCambioAll, buscarDespesas } from '../services/missao';

export default function CsvScreen() {
    const user = useJwt();  
    const [cambio, setCambio] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const { missao_id, missao_name } = useLocalSearchParams();   
    
    useEffect(() => {
        const carregarCambios = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarCambioAll(token);            
                setCambio(data || []);
            } catch (error) {
                console.error('Erro ao buscar câmbios:', error);
            }
        };

        const carregarDespesas = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarDespesas(token, missao_id); 
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
            let csvContent = `Missão: ${missao_name}\n\n`;
            
            // ➡️ Adicionando os dados de câmbio
            csvContent += `Dados de Câmbio:\n`;
            csvContent += `Moeda Origem,Moeda Destino,Cotação,Total a Cambiar,Total Cambiado,Número Recibo\n`;
            cambio.forEach((item) => {
                csvContent += `${item.moeda_origem || ''},${item.moeda_destino || ''},${item.cotacao || ''},${item.total_a_cambiar || ''},${item.total_cambiado || ''},${item.numero_recibo || ''}\n`;
            });

            // ➡️ Adicionando os dados de despesas
            csvContent += `\nDados de Despesas:\n`;
            csvContent += `Moeda,Valor,Cidade,Descrição,Outro,Data,Numero Recibo\n`;
            despesas.forEach((item) => {
                const descricao = Array.isArray(item.descricao) && item.descricao.length > 0 
                    ? item.descricao.join(', ') 
                    : item.outro || '';
                csvContent += `${item.moeda || ''},${item.valor || ''},${item.cidade || ''},${descricao},${item.outro || ''},${item.data_padrao || ''},${item.numero_recibo || ''}\n`;
            });

            const fileUri = `${FileSystem.documentDirectory}relatorio.csv`;

            // ➡️ Salvando o arquivo CSV
            await FileSystem.writeAsStringAsync(fileUri, csvContent, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            Alert.alert('Sucesso', `Arquivo CSV salvo em:\n${fileUri}`);
            console.log(`Arquivo CSV salvo em: ${fileUri}`);
        } catch (error) {
            console.error('Erro ao salvar CSV:', error);
            Alert.alert('Erro', 'Falha ao salvar o arquivo CSV.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Exportar Relatório</Text>
            <TouchableOpacity style={styles.button} onPress={exportarCSV}>
                <Text style={styles.buttonText}>Salvar CSV</Text>
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
