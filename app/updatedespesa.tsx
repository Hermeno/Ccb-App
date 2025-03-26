import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button, Modal, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarDespesaOne, atualizarDespesa } from '../services/despesas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Update() {
  const router = useRouter();
  const { id_despesa } = useLocalSearchParams();
  const [valor, setValor] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero_recibo, setNumero_recibo] = useState('');
  const [descricao, setDescricao] = useState<string[]>([]);
  const [data_padrao, setData_padrao] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const opcoes = [
    { id: '1', label: 'Taxi' },
    { id: '2', label: 'Almoço' },
    { id: '3', label: 'Hospedagem' },
    { id: '4', label: 'Atendimento' },
    { id: '5', label: 'Bilhete Aerea' },
    { id: '6', label: 'Cafe de Manha' },
    { id: '7', label: 'Janta' },
    { id: '8', label: 'Lanche' },
    { id: '9', label: 'Medicamentos' },
    { id: '10', label: 'Taxi / Uber' },
  ];

  useEffect(() => {
    const carregarDespesa = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarDespesaOne(token, id_despesa);
        setValor(data.valor);
        setCidade(data.cidade);
        setNumero_recibo(data.numero_recibo);
        setDescricao(JSON.parse(data.descricao));
        setData_padrao(new Date(data.data_padrao));
      } catch (error) {
        console.error('Erro ao carregar despesa:', error);
      }
    };
    carregarDespesa();
  }, [id_despesa]);

  const handleSelectItem = (item: string) => {
    if (descricao.includes(item)) {
      setDescricao(descricao.filter((desc) => desc !== item));
    } else {
      setDescricao([...descricao, item]);
    }
  };

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('userToken');

    if (!valor || !cidade || !numero_recibo) {
      Alert.alert('Erro', 'Todos os campos precisam ser preenchidos.');
      return;
    }

    if (descricao.length === 0) {
      Alert.alert('Erro', 'Pelo menos uma categoria precisa ser selecionada.');
      return;
    }

    try {
      await atualizarDespesa(
        {
          id_despesa,
          valor,
          cidade,
          descricao: JSON.stringify(descricao),
          numero_recibo,
          data_padrao: data_padrao.toISOString(),
        },
        token
      );

      Alert.alert('Sucesso!', 'Despesa atualizada com sucesso!');
      router.push('/home');
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a despesa.');
    }
  };

  const onChangedata_padrao = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || data_padrao;
    setShowInicio(false);
    setData_padrao(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Data */}
        <Text style={styles.label}>Data</Text>
        <Button onPress={() => setShowInicio(true)} title="Escolher data" />
        {showInicio && (
          <DateTimePicker value={data_padrao} mode="date" display="default" onChange={onChangedata_padrao} />
        )}

        {/* Cidade */}
        <Text style={styles.label}>Cidade</Text>
        <TextInput 
          value={cidade} 
          onChangeText={setCidade} 
          style={styles.input} 
          placeholder="Digite a cidade" 
        />

        {/* Valor */}
        <Text style={styles.label}>Valor</Text>
        <TextInput 
          value={valor} 
          onChangeText={setValor} 
          style={styles.input} 
          placeholder="Digite o valor" 
          keyboardType="numeric" 
        />

        {/* Número de recibo */}
        <Text style={styles.label}>Nº do Recibo</Text>
        <TextInput 
          value={numero_recibo} 
          onChangeText={setNumero_recibo} 
          style={styles.input} 
          placeholder="Digite o número do recibo" 
        />

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text>{descricao.length > 0 ? descricao.join(', ') : 'Selecione uma ou mais opções'}</Text>
        </TouchableOpacity>

        {/* Modal para opções */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={opcoes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, descricao.includes(item.label) && styles.optionSelected]}
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

