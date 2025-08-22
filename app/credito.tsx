import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform ,KeyboardAvoidingView, ScrollView, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [referencia, setReferencia] = useState<string[]>([]);
 const handleSelecionarR = (valor: string) => {
  setReferencia(prev =>
    prev.includes(valor)
      ? prev.filter(item => item !== valor)
      : [...prev, valor]
  );
};


  const [valor, setValor] = useState('');
  // const [referencia, setReferencia] = useState('');
  const [missaoId, setMissaoId] = useState<string | null>(null);
  const [missaoName, setMissaoName] = useState('');
  const [loading, setLoading] = useState(false);
  const [data_padrao, setData_padrao] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const showdata_padrao = () => {
    setShowInicio(true);
  };

  const onChangedata_padrao = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || data_padrao;
    setShowInicio(Platform.OS === 'ios' ? true : false);
    setData_padrao(currentDate);
  };














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
  if (loading) return; // evita duplo clique

  const token = await AsyncStorage.getItem('userToken');

  // 🔹 Validações ANTES de setLoading(true)
  if (!moeda || !valor || !referencia.length) {
    Alert.alert('Preencha todos os campos obrigatórios.'); 
    return;
  }
  if (!user) {
    Alert.alert('Usuário não identificado.');
    return;
  }
  if (!token) {
    Alert.alert('Token não encontrado. Faça login novamente.');
    return;
  }

  // 🔹 Só aqui ativa o loading
  setLoading(true);
  // const valorNumerico = Number(valor.replace(',', '.'));
const valorNumerico = Number(
  valor.replace(/\./g, '').replace(',', '.')
);
console.log('Valor numérico:', valorNumerico);
  try {
    await cadastrarCredito(
      {
        user_id: user.id,
        moeda,
        valor: valorNumerico,
        data_padrao: data_padrao,
        referencia: referencia.join(', '),
        missao_id: missaoId,
      },
      token
    );

    Alert.alert('Sucesso!', 'Cadastrado com sucesso!');
    setMoeda('');
    setValor('');
    setReferencia([]);
    router.replace('/home');
  } catch (error) {
    Alert.alert('Erro', 'Ocorreu um erro ao cadastrar seu crédito. Tente novamente.');
  } finally {
    setLoading(false); // 🔹 libera o botão novamente
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
          <TextInput  style={styles.input}  placeholder="Digite o valor"  value={valor}  onChangeText={setValor} keyboardType="default" />
          <Text style={styles.label}>Referência:</Text>
          <View style={styles.listaContainer}>
          {referencias.map((item) => (
            <TouchableOpacity key={item} style={[   styles.item,   referencia.includes(item) && styles.itemSelecionado ]}
              onPress={() => handleSelecionarR(item)}>
              <Text style={styles.itemTexto}>
                {item} {referencia.includes(item) ? '✅' : ''}
              </Text>
            </TouchableOpacity>
          ))}
          </View>

            <View style={styles.ViewFlex}>
                <View style={styles.ViewInputOne} >
                <Text style={styles.TextInputs}>Selecione a data</Text>
                    <Button  onPress={showdata_padrao} title="Escolher data" />
                        <Text  style={styles.textoEscolhido}>{data_padrao.toLocaleDateString()}</Text>
                        {showInicio && (
                            <DateTimePicker value={data_padrao} mode="date" display="default" onChange={onChangedata_padrao} />
                        )}
                </View>
            </View>





            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.5 }]}
              onPress={cadastrar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
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
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: '#f9f9f9',
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  borderRadius: 15,

  marginBottom: 20,
},

item: {
  padding: 7,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 12,
  minWidth: '30%',   // ocupa pelo menos 30% da largura
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,   // espaço entre os itens horizontal
  marginBottom: 10,  // espaço entre linhas
},

  itemSelecionado: {
    backgroundColor: '#d1e7dd',
    borderColor: '#0f5132',
  },
  itemTexto: {
    fontSize: 16,
  },
  ViewFlex: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginBottom: 10,
  },
  ViewInput: {
    width: '48%',
    marginBottom: 10,
  },
  ViewInputOne: {
    width: '100%',
    marginBottom: 1,
  },
  TextInputs: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  textoEscolhido: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },



});
