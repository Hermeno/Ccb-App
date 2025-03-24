import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button, Modal, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { buscarCreditos, buscarDespesa, atualizarDespesa } from '../services/despesas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Update() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ID da despesa para buscar e atualizar
  const [valor, setValor] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero_recibo, setNumero_recibo] = useState('');
  const [moeda, setMoeda] = useState('');
  const [descricao, setDescricao] = useState<string[]>([]);
  const [data_padrao, setData_padrao] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [creditos, setCreditos] = useState([]);
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
    const carregarCreditos = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarCreditos(token);
        setCreditos(data);
      } catch (error) {
        console.error('Erro ao carregar créditos:', error);
      }
    };

    const carregarDespesa = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarDespesa(id, token); // Busca os dados da despesa existente
        setValor(data.valor);
        setCidade(data.cidade);
        setNumero_recibo(data.numero_recibo);
        setMoeda(data.moeda);
        setDescricao(JSON.parse(data.descricao));
        setData_padrao(new Date(data.data_padrao));
      } catch (error) {
        console.error('Erro ao carregar despesa:', error);
      }
    };

    carregarCreditos();
    carregarDespesa();
  }, [id]);

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
          id,
          moeda,
          valor,
          cidade,
          descricao: JSON.stringify(descricao),
          numero_recibo,
          data_padrao: data_padrao.toISOString(),
        },
        token
      );

      Alert.alert('Sucesso!', 'Despesa atualizada com sucesso!');
      router.push('/home'); // Redireciona após o update
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
      {/* Seleção de moeda */}
      <Picker selectedValue={moeda} onValueChange={(itemValue) => setMoeda(itemValue)} style={styles.picker}>
        <Picker.Item label="Selecione uma moeda..." value="" />
        {creditos.map((credito) => (
          <Picker.Item key={credito.id} label={`${credito.moeda} - R$ ${credito.valor.toFixed(2)}`} value={credito.moeda} />
        ))}
      </Picker>

      {/* Data */}
      <Button onPress={() => setShowInicio(true)} title="Escolher data" />
      {showInicio && (
        <DateTimePicker value={data_padrao} mode="date" display="default" onChange={onChangedata_padrao} />
      )}

      {/* Cidade */}
      <TextInput value={cidade} onChangeText={setCidade} style={styles.input} placeholder="Cidade" />

      {/* Valor */}
      <TextInput value={valor} onChangeText={setValor} style={styles.input} placeholder="Valor" keyboardType="numeric" />

      {/* Número de recibo */}
      <TextInput value={numero_recibo} onChangeText={setNumero_recibo} style={styles.input} placeholder="Nº do Recibo" />

      {/* Descrição */}
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text>{descricao.length > 0 ? descricao.join(', ') : 'Selecione uma ou mais opções'}</Text>
      </TouchableOpacity>

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
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});

