import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity , Alert} from 'react-native';
import { useRouter,useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarCredito, buscarCreditoLimit } from '@/services/credito';
import { useJwt } from './jwt';

export default function App() {
  const router = useRouter();
  const user = useJwt(); 

  const [creditos, setCreditos] = useState([]);
  const [creditosLimit, setCreditosLimit] = useState([]);

  const { missao_id, missao_name } = useLocalSearchParams();
  // const [missaoId, setMissaoId] = useState<string | null>(null);
  // const [missaoName, setMissaoName] = useState('');  
  // useEffect(() => {
  //    const fetchMissao = async () => {
  //      const missao_id = await AsyncStorage.getItem('missao_id');
  //      const missao_name = await AsyncStorage.getItem('missao_name');         
  //      if (missao_id) {
  //        setMissaoId(missao_id);
  //      }
  //      if (missao_name) {
  //        setMissaoName(missao_name);
  //      }
  //    };   
  //    fetchMissao();
  //  }, []);  





  // UseEffect para buscar créditos
  useEffect(() => {
    const carregarCredito = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarCredito(token, missao_id); // Passando missao_id para buscarCredito
        setCreditos(data || []);
      } catch (error) {
        console.error('Erro ao buscar créditos:', error);
      }
    };

    carregarCredito();
  }, [missao_id]);  // Certifique-se de que `missao_id` seja dependência para refazer a requisição se necessário

  // UseEffect para buscar créditos limitados
  useEffect(() => {
    const carregarCreditoLimit = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarCreditoLimit(token, missao_id);
        setCreditosLimit(Array.isArray(data) ? data : data ? [data] : []);
      } catch (error) {
        console.error('Erro ao buscar créditos:', error);
      }
    };

    carregarCreditoLimit();
  }, []);


function moedaEmPortugues(moeda: string) {
  switch (moeda?.toLowerCase()) {
    case 'dolar':
      return 'Dólar';
    case 'real':
      return 'Real';
    case 'metical':
      return 'Metical';
    case 'euro':
      return 'Euro';
    case 'libra':
      return 'Libra';
    case 'iene':
      return 'Iene';
    default:
      return capitalizeFirstLetter(moeda);
  }
}
function capitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


  return (
    <View style={styles.container}>
      {creditosLimit.length > 0 ? (
        creditosLimit.map((credito) => (
          <TouchableOpacity key={credito.id} style={styles.cardTop}>
            <Text style={styles.titleTop}>Saldo Disponível</Text>
            <Text style={styles.titleTop}>Em {credito.moeda}</Text>
            <Text style={styles.titleTop}>{Number(credito.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>SEM SALDO</Text>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {creditos.length > 0 ? (
          creditos.map((credito) => (
            <TouchableOpacity key={credito.id} style={styles.Top}>
              <Text style={styles.TopTitle}>Saldo em {moedaEmPortugues(credito.moeda)}</Text>
              <Text style={styles.cardAmount}>{Number(credito.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma moeda encontrada</Text>
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#487d76',
    // paddingHorizontal: 16,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    bottom: 0,
    width: '100%',
    position: 'absolute',
    height: '95%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  Top: {
    backgroundColor: '#fff',
    // borderRadius: 12,
    // paddingVertical: 20,
    // paddingHorizontal: 16,
    // marginBottom: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
    // borderWidth: 1,
    // borderColor: '#ddd',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#FF0000',
    marginTop: 20,
  },
  cardTop:{
    margin: 10,
    backgroundColor: 'transparent',
    padding: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 10,
    borderRadius:10
},
titleTop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
}
});

