import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform ,KeyboardAvoidingView, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cadastrarCredito } from '../services/credito';
import { useRouter } from 'expo-router';
import { useJwt } from './jwt';




const moedas = [
  { label: 'Dólar', value: 'dolar' },
  { label: 'Real', value: 'real' },
  { label: 'Metical', value: 'metical' },
  { label: 'Euro', value: 'euro' },
  { label: 'Libra', value: 'libra' },
  { label: 'Iene', value: 'iene' },
];


const referencias = [
  'Atendimento',
  'Alimentação',
  'Bilhetes',
  'Hospedagem',
  'Diversos',
];

export default function Home() {
  const router = useRouter();
  const user = useJwt();

  // const [moeda, setMoeda] = useState('');
  const [moeda, setMoeda] = useState('');
  const handleSelecionar = (value) => {
    setMoeda(prev => prev === value ? '' : value);
  };
  const [referencia, setReferencia] = useState('');
  const handleSelecionarR = (valor) => {
    setReferencia(prev => prev === valor ? '' : valor);
  };



  const [valor, setValor] = useState('');
  // const [referencia, setReferencia] = useState('');
  const [missaoId, setMissaoId] = useState<string | null>(null);
  const [missaoName, setMissaoName] = useState('');















  useEffect(() => {
    const fetchMissao = async () => {
      const missao_id = await AsyncStorage.getItem('missao_id');
      const missao_name = await AsyncStorage.getItem('missao_name');
      if (missao_id) setMissaoId(missao_id);
      if (missao_name) setMissaoName(missao_name);
    };
    fetchMissao();
  }, []);

  const cadastrar = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!moeda  || !valor || !referencia) {
      Alert.alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!user) {
      Alert.alert('Usuário não identificado.');
      return;
    }

    try {
      if (!token) {
        Alert.alert('Token não encontrado. Faça login novamente.');
        return;
      }

      await cadastrarCredito(
        {
          user_id: user.id,
          moeda: moeda,
          valor,
          referencia,
          missao_id: missaoId,
        },
        token
      );

      Alert.alert('Sucesso!', 'Cadastrado com sucesso!');
      setMoeda('');
      setValor('');
      setReferencia('');
      router.replace('/home');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar seu crédito. Tente novamente.');
    }
  };




return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={80} // ajuste conforme o header do seu app
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Adicionar Crédito</Text>

          <Text style={styles.label}>Moeda:</Text>
          <View style={styles.listaContainer}>
            {moedas.map((moedaDB) => (
              <TouchableOpacity
                key={moedaDB.value}
                style={[styles.item, moeda === moedaDB.value && styles.itemSelecionado]}
                onPress={() => handleSelecionar(moedaDB.value)}
              >
                <Text style={styles.itemTexto}>
                  {moedaDB.label} {moeda === moedaDB.value ? ' ✅' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Valor creditado:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o valor"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Referência:</Text>
          <View style={styles.listaContainer}>
            {referencias.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.item, referencia === item && styles.itemSelecionado]}
                onPress={() => handleSelecionarR(item)}
              >
                <Text style={styles.itemTexto}>
                  {item} {referencia === item ? '✅' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={cadastrar}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    // backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    // elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00835f',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#00835f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },




  listaContainer: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: '#f9f9f9',
        borderWidth: 1,
    borderColor: '#ccc',
    padding:10,
    borderRadius:15
  },
  item: {
    padding: 7,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
  },
  itemSelecionado: {
    backgroundColor: '#d1e7dd',
    borderColor: '#0f5132',
  },
  itemTexto: {
    fontSize: 16,
  },


});
