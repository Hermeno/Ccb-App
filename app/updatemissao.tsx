import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Button, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from './jwt'
import { editarMissao, buscarMissaoPorId } from '../services/missao';

export default function UpdateMissao() {
  const router = useRouter();
  const { missao_id, missao_name } = useLocalSearchParams();
const user = useJwt();
  const [missao, setMissao] = useState('');
  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');
  const [cidade, setCidade] = useState('');
  const [data_inicio_prevista, setData_inicio_prevista] = useState(new Date());
  const [data_final_prevista, setData_final_prevista] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const carregarMissao = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (missao_id && token) {
          const dados = await buscarMissaoPorId(missao_id, token);
          if (dados && dados.length > 0) {
            const missao = dados[0];
            setMissao(missao.missao);
            setPais(missao.pais);
            setEstado(missao.estado);
            setCidade(missao.cidade);
            setData_inicio_prevista(new Date(missao.data_inicio_prevista));
            setData_final_prevista(new Date(missao.data_final_prevista));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar missão:', error);
        Alert.alert('Erro', 'Erro ao carregar missão.');
      }
    };
  
    carregarMissao();
  }, [missao_id]);
  
  

  const onChangedata_inicio_prevista = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || data_inicio_prevista;
    setShowInicio(Platform.OS === 'ios' ? true : false);
    setData_inicio_prevista(currentDate);
  };

  const onChangedata_final_prevista = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || data_final_prevista;
    setShowFinal(Platform.OS === 'ios' ? true : false);
    setData_final_prevista(currentDate);
  };

  const salvar = async () => {
    const token = await AsyncStorage.getItem('userToken');
   if (!missao || !estado || !cidade) {
        Alert.alert('Erro!', 'Preencha todos os campos obrigatórios.');
        return;
    }
    try {
        if (!user) {
            Alert.alert('Erro', 'Usuário não identificado.');
            return;
        }
        
        const response = await editarMissao({
            missao_id:missao_id,
            missao,
            estado,
            cidade,
            data_inicio_prevista,
            data_final_prevista,
            pais,
            username: user.name
        }, token);

        Alert.alert('Sucesso!', 'Missão atualizada com sucesso!');
        setCidade('');
        setPais('');
        setEstado('');
        setMissao('');
    } catch (error) {
        console.error('Erro ao atualizar missão', error);
        Alert.alert('Erro', 'Erro ao atualizar missão');
    }





};


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Missão</Text>
      <TextInput
        value={missao}
        onChangeText={setMissao}
        style={styles.input}
        placeholder="Nome da missão"
      />

      <Text style={styles.label}>País</Text>
      <TextInput
        value={pais}
        onChangeText={setPais}
        style={styles.input}
        placeholder="País"
      />

      <Text style={styles.label}>Estado</Text>
      <TextInput
        value={estado}
        onChangeText={setEstado}
        style={styles.input}
        placeholder="Estado"
      />

      <Text style={styles.label}>Cidade</Text>
      <TextInput
        value={cidade}
        onChangeText={setCidade}
        style={styles.input}
        placeholder="Cidade"
      />

      <Text style={styles.label}>Data de Início</Text>
      <Button onPress={() => setShowInicio(true)} title="Selecionar data" />
      <Text>{data_inicio_prevista.toLocaleDateString()}</Text>
      {showInicio && (
        <DateTimePicker
          value={data_inicio_prevista}
          mode="date"
          display="default"
          onChange={onChangedata_inicio_prevista}
        />
      )}

      <Text style={styles.label}>Data Final</Text>
      <Button onPress={() => setShowFinal(true)} title="Selecionar data" />
      <Text>{data_final_prevista.toLocaleDateString()}</Text>
      {showFinal && (
        <DateTimePicker
          value={data_final_prevista}
          mode="date"
          display="default"
          onChange={onChangedata_final_prevista}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

