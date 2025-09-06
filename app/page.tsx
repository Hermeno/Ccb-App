import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { buscarRelatorioTable, baixarRelatorioPdf  } from '../services/credito'; // seu intermediário
import { Link, useRouter, useLocalSearchParams   } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RelatorioExportarPDF from './RelatorioExportarPDF';


const RelatorioPage = () => {
   const router = useRouter();
  const [relatorio, setRelatorio] = useState([]);
  const [loading, setLoading] = useState(true);
  const { missaoId, missao_name } = useLocalSearchParams();

  const fetchRelatorio = async () => {
    try { 
      const dados = await buscarRelatorioTable(missaoId);
      setRelatorio(dados);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorio();
  }, []);


  const gerarRelatorio = async () => {
  try {
    await baixarRelatorioPdf(missaoId); // missaoId já vem de useLocalSearchParams
  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
  }
};

  if (loading) {
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  return (
  <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
      <Button title="Gerar Relatório em PDF" onPress={gerarRelatorio} />
    </View>
    {relatorio.map((grupo: any, index: number) => (
      <View key={grupo.cambio_id || index} style={styles.card}>
        <Text style={styles.title}>{grupo.moeda}</Text>
        <Text style={styles.info}>Total Cambiado: {grupo.valor_cambiado} {grupo.moeda}</Text>
        <Text style={styles.info}>Total Despesas: {grupo.total_despesas} {grupo.moeda}</Text>
        <Text style={styles.info}>Sobra: {grupo.sobra} {grupo.moeda}</Text>

        <Text style={styles.subTitle}>Despesas:</Text>
        {grupo.despesas.length > 0 ? (
          grupo.despesas.map((despesa: any, index: number) => (
            <View key={index} style={styles.despesaItem}>
              <Text>{despesa.descricao}</Text>
              <Text>{despesa.valor} {grupo.moeda}</Text>
            </View>
          ))
        ) : (
          <Text style={{ fontStyle: 'italic' }}>Sem despesas</Text>
        )}
        {/* <RelatorioExportarPDF dados={relatorio} /> */}
      </View>
      
    ))}
  </ScrollView>
  );
};

export default RelatorioPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f1f1',
  },
  loading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    color: '#333',
  },
  subTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  info: {
    fontSize: 15,
    marginBottom: 2,
  },
  despesaItem: {
    marginTop: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
  },
});
