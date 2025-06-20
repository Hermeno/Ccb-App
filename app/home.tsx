import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useJwt } from './jwt';
import { buscarCreditoLimit } from '@/services/credito';
import { buscarMissaoPorId } from '../services/missao';

export default function HomeScreen() {
  const router = useRouter();
  const user = useJwt();
  // const [creditos, setCreditos] = useState([]);
  // const [missoes, setMissoes] = useState([]);
  // const [atualizar, setAtualizar] = useState(false);


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
  

   const [token, setToken] = useState(null);
   const [missaoId, setMissaoId] = useState(null);
   const [missaoName, setMissaoName] = useState('');
   const [creditos, setCreditos] = useState([]);
 
   // Buscar dados do AsyncStorage
   useEffect(() => {
     const fetchStorageData = async () => {
       const storedToken = await AsyncStorage.getItem('userToken');
       const storedMissaoId = await AsyncStorage.getItem('missao_id');
       const storedMissaoName = await AsyncStorage.getItem('missao_name');
 
       if (!storedToken) {
         router.replace('/'); // redireciona pro login
         return;
       }
 
       setToken(storedToken);
       setMissaoId(storedMissaoId);
       setMissaoName(storedMissaoName);
     };
 
     fetchStorageData();
   }, []);
 
   // Buscar créditos periodicamente
   useEffect(() => {
     if (!token || !missaoId) return;
 
     const carregarCredito = async () => {
       try {
         const data = await buscarCreditoLimit(token, missaoId);
         setCreditos(Array.isArray(data) ? data : data ? [data] : []);
       } catch (error) {
         console.error('Erro ao buscar créditos:', error);
       }
     };
 
     carregarCredito(); // Carrega uma vez ao iniciar
 
     const interval = setInterval(() => {
       carregarCredito();
     }, 5000); // atualiza a cada 5 segundos
 
     return () => clearInterval(interval); // limpa intervalo ao desmontar
   }, [token, missaoId]);
 
   // Logout
   const Logout = async () => {
     await AsyncStorage.removeItem('userToken');
     await AsyncStorage.removeItem('missao_id');
     await AsyncStorage.removeItem('missao_name');
     router.replace('/'); // redireciona para o login
   };
 
  const sendOutraMoedas = () => {
    if (missaoId) router.push(`/outras_moedas?missao_id=${missaoId}&missao_name=${missaoName}`);
  };

  const CREDITO = () => {
    if (missaoId) router.push(`/credito?missao_id=${missaoId}&missao_name=${missaoName}`);
  };

  const CAMBIO = () => {
    if (missaoId) router.push(`/cambio?missao_id=${missaoId}&missao_name=${missaoName}`);
  };
  const CAMBIOViSUALIZAR= () => {
    if (missaoId) router.push(`/cambios?missao_id=${missaoId}&missao_name=${missaoName}`);
  };

  const MISSAO = () => {
    router.push(`/missao?missao_id=${missaoId}&missao_name=${missaoName}`);
  };

  const DESPESA = () => {
    if (missaoId) router.push(`/despesas?missao_id=${missaoId}&missao_name=${missaoName}`);
  };

  const DESPESAVISUALIZATION = () => {
    if (missaoId) router.push(`/despesas?missao_id=${missaoId}&missao_name=${missaoName}`);
  };
  

  return (
    <View style={styles.container}>
          <View>
            <View style={styles.cardInfoFirstLeft}>
              <Text style={styles.title}>Missão: {missaoName}</Text>
            </View>
          </View>
      {/* Exibe os créditos */}
      {creditos.length > 0 ? (
        creditos.map((credito) => (
          <TouchableOpacity key={credito.id} style={styles.card}>
            <Text style={styles.title}>Saldo Disponível</Text>
            <Text style={styles.title}>Em {credito.moeda}</Text>
            <Text style={styles.title}>R$ {credito.valor}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhuma moeda encontrada</Text>
      )}

      {/* Botões de navegação */}
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.cardInfo} onPress={sendOutraMoedas}>
          <Text style={styles.Textshow}>Outras Moedas</Text>
          <MaterialIcons name="arrow-forward" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardInfo} onPress={CREDITO}>
          <Text style={styles.Textshow}>Crédito</Text>
          <MaterialIcons name="arrow-forward" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardInfo} onPress={CAMBIO}>
          <Text style={styles.Textshow}>Cadastrar Câmbio</Text>
          <MaterialIcons name="arrow-forward" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardInfo} onPress={CAMBIOViSUALIZAR}>
          <Text style={styles.Textshow}>Visualizar Câmbio</Text>
          <MaterialIcons name="arrow-forward" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardInfo} onPress={MISSAO}>
          <Text style={styles.Textshow}>Missão</Text>
          <MaterialIcons name="arrow-forward" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardInfo} onPress={DESPESA}>
          <Text style={styles.Textshow}>Cadastrar despesas </Text>
          <MaterialIcons name="arrow-forward" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardInfo} onPress={DESPESAVISUALIZATION}>
          <Text style={styles.Textshow}>Visualizar despesas </Text>
          <MaterialIcons name="arrow-forward" size={30} color="black" />
        </TouchableOpacity>        
        <TouchableOpacity style={styles.cardInfoOut} onPress={Logout}>
          <Text style={styles.Textshow}>Sair</Text>
          <MaterialIcons name="logout" size={30} color="red" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#487d76',
  },
  content: {
    padding: 10,
    width: '100%',
    backgroundColor: '#fafafa',
    bottom: 0,
    position: 'absolute',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: '85%',
  },
  cardInfo: {
    margin: 5,
    backgroundColor: 'transparent',
    padding: 20,
    color: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  cardInfoOut: {
    margin: 5,
    backgroundColor: 'transparent',
    padding: 20,
    color: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderRadius: 20,
  },
  Textshow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00835f',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
  },
  cardInfoFirstLeft: {
    textAlign: 'center',
    alignItems: 'center',
  },
  card:{
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
});