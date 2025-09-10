import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button, Modal, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarDespesaOne, atualizarDespesa, buscarImagens } from '../services/despesas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { markNodeAsRemovable } from 'react-native-reanimated/lib/typescript/core';

export default function Update() {
  const router = useRouter();
  const { id_despesa } = useLocalSearchParams();



  const [valor, setValor] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero_recibo, setNumero_recibo] = useState('');
  const [descricao, setDescricao] = useState<string[]>([]);
  const [data_padrao, setData_padrao] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [moeda, setMoeda] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [imagensData, setImagensData] = useState([]);


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
  const opcoes = [
    { id: '1', label: 'Almoço' },
    { id: '3', label: 'Atendimento' },
    { id: '2', label: 'Bilhete Aerea' }, 
    { id: '4', label: 'Cafe de Manhá' },
    { id: '5', label: 'Hospedagem' },
    { id: '6', label: 'Janta' },
    { id: '7', label: 'Lanche' },
    { id: '8', label: 'Medicamentos' },
    { id: '9', label: 'Taxi / Uber' }
  ];

  useEffect(() => {
    const carregarDespesa = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarDespesaOne(token, id_despesa);
        setCidade(data.cidade);
        setNumero_recibo(data.numero_recibo);
        setDescricao(data.descricao);
        setMoeda(data.moeda);
        setData_padrao(new Date(data.data_padrao));
        setValor((data.valor / 100).toFixed(2).replace('.', ','));
        console.log('Despesa carregada:', data);
      } catch (error) {
        console.error('Erro ao carregar despesa:', error);
      }
    };
    carregarDespesa();
  }, [id_despesa]);

  const handleSelectItem = (item: string) => {
    setDescricao(item); // Define o item como a descrição, substituindo a anterior
    setModalVisible(false); // Fecha o modal assim que o item for selecionado
  };

 const DOWNLOD = () => {
  // router.push(`/image?id_post=${id_despesa}`)
  router.replace(`/image?id_post=${id_despesa}`);
 }







  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('userToken');

    if (!valor || !cidade || !numero_recibo) {
      Alert.alert( 'Todos os campos precisam ser preenchidos.');
      return;
    }

    if (descricao.length === 0) {
      Alert.alert( 'Pelo menos uma categoria precisa ser selecionada.');
      return;
    }
          function parseValor(valor: string) {
            if (valor.includes(',')) {
              return Number(valor.replace(/\./g, '').replace(',', '.'));
            }
            return Number(valor);
          }
          const valorNumerico = parseValor(valor);
          if (isNaN(valorNumerico)) {
            Alert.alert('Valor numérico inválido. Use apenas números e vírgulas para decimais.');
            return;
          }

    try {
      await atualizarDespesa(
        {
          id_despesa,
          valor: valorNumerico,
          cidade,
          descricao: descricao,
          moeda,
          numero_recibo,

          data_padrao: data_padrao.toISOString(),
        },
        token
      );

      Alert.alert('Sucesso!', 'Despesa atualizada com sucesso!');
      router.replace(`/home`);
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      Alert.alert( 'Não foi possível atualizar a despesa.');
    }
  };

  const onChangedata_padrao = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || data_padrao;
    setShowInicio(false);
    setData_padrao(currentDate);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80} >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Data</Text>
        <Button onPress={() => setShowInicio(true)} title="Escolher data" />
        {showInicio && ( <DateTimePicker value={data_padrao} mode="date" display="default" onChange={onChangedata_padrao} /> )}

        <Text style={styles.label}>Cidade</Text>
        <TextInput  value={cidade}  onChangeText={setCidade}  style={styles.input}  placeholder="Digite a cidade"  />

        {/* Valor */}
        <Text style={styles.label}>Valor</Text>
        <TextInput  value={valor}  onChangeText={setValor}  style={styles.input}  placeholder="Digite o valor" keyboardType='default'/>


        {/* make input moeda but is imutable and giv some background color to identify like editable*/}
        <Text style={styles.label}>Moeda</Text>
        <TextInput  value={moeda}  editable={false}  style={[styles.input, { backgroundColor: '#cfccccff' }]}  placeholder="Moeda" />


        {/* Número de recibo */}
        <Text style={styles.label}>Nº do Recibo</Text>
        <TextInput   value={numero_recibo}   onChangeText={setNumero_recibo}   style={styles.input}   placeholder="Digite o número do recibo" />

          <Text style={styles.label}>Descrição</Text>
              <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
                <Text>
                  {descricao.length > 0 ? descricao : 'Selecione uma opção'} 
                </Text>
              </TouchableOpacity>

              {/* Modal para opções */}
              <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <FlatList
                    data={opcoes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.optionItem, descricao === item.label && styles.optionSelected]} 
                        onPress={() => handleSelectItem(item.label)} 
                      >
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <Button title="Fechar" onPress={() => setModalVisible(false)} />
                </View>
              </Modal>


        {/* Botão para atualizar */}
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Atualizar Despesa</Text>
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
    padding: 20,
  },
  content: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  optionItem: {
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 5,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: '#E0E0E0',
  },
});

