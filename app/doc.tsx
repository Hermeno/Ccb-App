import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarDespesas } from '@/services/despesas';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ExportarDespesas() {
  const [despesas, setDespesas] = useState([]);
  const { missaoId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const carregarDespesas = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarDespesas(token, missaoId);
        setDespesas(data || []);
      } catch (error) {
        Alert.alert('Erro ao buscar despesas');
      }
    };
    carregarDespesas();
  }, [missaoId]);

  // Função para converter para CSV
  const exportarCSV = async () => {
    if (!despesas.length) {
      Alert.alert('Nenhuma despesa para exportar.');
      return;
    }

    // Cabeçalho CSV
    const header = [
      'moeda',
      'valor',
      'cidade',
      'descricao',
      'outro',
      'data_padrao',
      'numero_recibo',
      'missao_id'
    ];

    // Linhas CSV
    const rows = despesas.map(d => [
      d.moeda,
      d.valor,
      d.cidade,
      d.descricao,
      d.outro,
      d.data_padrao,
      d.numero_recibo,
      d.missao_id
    ]);

    // Monta CSV
    const csv = [
      header.join(','),
      ...rows.map(r => r.map(item => `"${item ?? ''}"`).join(','))
    ].join('\n');

    // Salva arquivo
    const fileUri = FileSystem.documentDirectory + 'despesas.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

    Alert.alert('Sucesso', `Arquivo CSV salvo em:\n${fileUri}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Exportar Despesas</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#2e7d32',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20
        }}
        onPress={exportarCSV}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Exportar CSV</Text>
      </TouchableOpacity>
      <ScrollView>
        {despesas.map((d, idx) => (
          <View key={idx} style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
            <Text>Moeda: {d.moeda}</Text>
            <Text>Valor: {d.valor}</Text>
            <Text>Cidade: {d.cidade}</Text>
            <Text>Descrição: {d.descricao}</Text>
            <Text>Outro: {d.outro}</Text>
            <Text>Data: {d.data_padrao}</Text>
            <Text>Recibo: {d.numero_recibo}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}