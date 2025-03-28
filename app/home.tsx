import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useJwt } from './jwt';
import { buscarCreditoLimit } from '@/services/credito';
import { buscarMissoes } from '../services/missao';

export default function HomeScreen() {
  const router = useRouter();
  const user = useJwt();
  const [creditos, setCreditos] = useState([]);
  // const [creditos, setCreditos] = useState<Credito[]>([]);
  const [missoes, setMissoes] = useState([]);
  const [missaoId, setMissaoId] = useState<string | null>(null);
  const [missaoName, setMissaoName] = useState<string | null>(null);
  const [atualizar, setAtualizar] = useState(false);
  // const [atualizarCredito, setAtualizarCredito] = useState(false);

  const carregarCredito = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log(token);
      const data = await buscarCreditoLimit(token);
      setCreditos(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error('Erro ao buscar créditos:', error);
    }
  };

  useEffect(() => {
    carregarCredito(); // Carrega uma vez ao iniciar
    const interval = setInterval(() => {
      carregarCredito(); // Atualiza os créditos a cada 5 segundos
    }, 5000); // Ajuste o intervalo conforme necessário (em milissegundos)

    return () => clearInterval(interval); // Limpa o intervalo quando o componente for desmontado
  }, []);



  const carregarMissoes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = await buscarMissoes(token);
      if (data && data.length > 0) {
        setMissoes(data);
        setMissaoId(data[0].id);
        setMissaoName(data[0].missao);
      } else {
        setMissoes([]);
        setMissaoId(null);
      }
    } catch (error) {
      console.error('Erro ao buscar missões:', error);
    }
  };
  useEffect(() => {
    carregarMissoes();
  }, [atualizar]);

  // Função para forçar a atualização
  const forcarAtualizacao = () => {
    setAtualizar(prev => !prev);  // Alterna o valor para forçar a atualização
  };

  // Intervalo para atualização automática das missões
  useEffect(() => {
    const interval = setInterval(() => {
      carregarMissoes();  // Atualiza automaticamente a cada 1 segundo
    }, 1000);

    return () => clearInterval(interval);  // Remove o intervalo ao desmontar
  }, []);

  // Funções de navegação para os botões
  const sendOutraMoedas = () => {
    if (missaoId) router.push(`/outras_moedas?missao_id=${missaoId}`);
  };

  const CREDITO = () => {
    if (missaoId) router.push(`/credito?missao_id=${missaoId}`);
  };

  const CAMBIO = () => {
    if (missaoId) router.push(`/cambio?missao_id=${missaoId}`);
  };
  const CAMBIOViSUALIZAR= () => {
    if (missaoId) router.push(`/cambios?missao_id=${missaoId}`);
  };

  const MISSAO = () => {
    router.push(`/missao?missao_id=${missaoId}`);
  };

  const DESPESA = () => {
    if (missaoId) router.push(`/despesas?missao_id=${missaoId}`);
  };

  const Logout = () => {
    AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Exibe as missões */}
      {(missoes.length > 0) ? (
        missoes.map((missao) => (
          <View key={missao.id}>
            <View style={styles.cardInfoFirstLeft}>
              <Text style={styles.title}>Missão: {missao.missao}</Text>
              {/* <Text style={styles.title}>País: {missao.pais}</Text> */}
              <Text style={styles.title}>Estado: {missao.status}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>CADASTRA UMA MISSAO</Text>
      )}

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
    height: '80%',
  },
  cardInfo: {
    margin: 10,
    backgroundColor: 'transparent',
    padding: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  cardInfoOut: {
    margin: 10,
    backgroundColor: 'transparent',
    padding: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    borderRadius: 10,
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