import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Button, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from './jwt'
import { editarMissao, buscarMissaoPorId } from '../services/missao';

export default function UpdateMissao() {
  const router = useRouter();
const user = useJwt();
  const [missao, setMissao] = useState('');
  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');
  const [cidade, setCidade] = useState('');
  const [data_inicio_prevista, setData_inicio_prevista] = useState(new Date());
  const [data_final_prevista, setData_final_prevista] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
const { missao_id, missao_name } = useLocalSearchParams();




  useEffect(() => {
    // let intervalId: NodeJS.Timeout;
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
        Alert.alert('Erro ao carregar missão.');
      }
    };
    // carregarMissao(); // Carregar os dados inicialmente

    // intervalId = setInterval(carregarMissao, 5000); // Atualizar a cada 5 segundos
  
    // return () => clearInterval(intervalId);   
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
        Alert.alert( 'Preencha todos os campos obrigatórios.');
        return;
    }
    try {
        if (!user) {
            Alert.alert('Usuário não identificado.');
            return;
        }
        
        const response = await editarMissao({
            missao_id,
            missao,
            estado,
            cidade,
            data_inicio_prevista,
            data_final_prevista,
            pais,
            username: user.name
        }, token);

        Alert.alert('Sucesso!', 'Missão atualizada com sucesso!');
        router.replace(`/home`);
    } catch (error) {
        console.error('Erro ao atualizar missão', error);
        Alert.alert('Erro ao atualizar missão');
    }





};


  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <Text style={styles.TextInput}>Missão</Text>
      <TextInput
        value={missao}
        onChangeText={setMissao}
        style={styles.input}
        placeholder="Nome da missão"
      />

      <Text style={styles.TextInput}>País</Text>
      <TextInput
        value={pais}
        onChangeText={setPais}
        style={styles.input}
        placeholder="País"
      />

      <Text style={styles.TextInput}>Estado</Text>
      <TextInput
        value={estado}
        onChangeText={setEstado}
        style={styles.input}
        placeholder="Estado"
      />

      <Text style={styles.TextInput}>Cidade</Text>
      <TextInput
        value={cidade}
        onChangeText={setCidade}
        style={styles.input}
        placeholder="Cidade"
      />

      <Text style={styles.TextInput}>Data de Início</Text>
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

      <Text style={styles.TextInput}>Data Final</Text>
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

      <TouchableOpacity style={styles.butonsMissaosVisualizarModal} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.butonsMissaosVisualizarModal, styles.BotaoLogin]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#487d76",
      alignItems: "center",
      // justifyContent: 'flex-end',  // Garante que o conteúdo vai para o fundo da tela
  },
  TextHeaderLogin: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#121212",
      marginBottom: 30,
      height: 120,
      paddingTop: 40,
  },
  input: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      width: "100%",
      backgroundColor: '#f0f0f0',
      height: 45,
      color: "#000",
      borderRadius: 10,
  },
  TextInput: {
      marginBottom: 3,
      fontSize: 16,
      color: "#121212",
      fontWeight: "bold",
      textAlign: "left",
      marginTop: 10,
  },
  BotaoLogin: {
      width: "100%",
      height: 50,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      marginBottom: 20,
  },
  footer: {
      position: 'absolute', // Fixa o footer
      bottom: 0,            // Cola no rodapé
      width: '100%',        // Ocupa a largura toda
      height: 70,           // Altura mínima de 70
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,  // Garantir que o footer esteja acima da Animated View
  },
  buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
  },
  content: {
      padding: 20,
      position: 'absolute',
      bottom: 0,  // Ajusta para começar acima do footer fixo
      width: '100%',
      height: '85%',
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // borderWidth: 1,
      borderTopColor: '#fafafa',
  },

  CardLogin: {
      padding: 10,
      width: '100%',       
  },

  TextBotao: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
  },
  ViewFlex:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // marginBottom: 20,
      width: '100%',
      columnGap: '10',
  },
  ViewInput:{
      width: '48%',
      marginBottom: 10,
  },  
  
  cardInfo:{
      margin: 10,
      backgroundColor: 'transparent',
      borderRadius: 0,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 5,
      elevation: 2,
      justifyContent: 'center',
      alignItems: 'center',
      height: 60,
      color: '#fff',
      // width: '100%',
  },
  Textshow:{
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff'
  },
  text_saldo:{
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4ac578'
  },
  cardInfoOut:{
      margin: 10,
      backgroundColor: 'transparent',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 5,
      elevation: 2,
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
      color: '#fff',
      marginTop:50,
  }, 

  textoEscolhido:{
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4ac578',
      marginTop: 10,
      // borderWidth: 5,
      borderBottomWidth: 1,
      borderColor: '#ccc',
  },
  cardMission: {
      marginBottom: 10,
      backgroundColor: 'transparent',
      borderRadius: 10,
      // margin:10,
      // borderWidth: 1,
      borderColor: '#fff',
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




  title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#777',
      marginTop: 20,
  },
  cardInfoFirstLeft:{
      width: '60%',
      // height: 80,
      backgroundColor: 'transparent',
      borderRadius: 20,
      justifyContent: 'center',
      // alignItems: 'left',
      // paddingLeft: 20,
  },
  cardInfoFirstLeftDown:{
      width: '60%',
      // height: 80,
      backgroundColor: 'transparent',
      borderRadius: 20,
      justifyContent: 'center',
      // alignItems: 'left',
      paddingLeft: 20,
  },

  butonsMissaosVisualizar:{
      padding:10,
      backgroundColor: '#fff',
      borderRadius: 10,

      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      borderWidth:1,
      borderColor: '#ccc',
  },


  butonsMissaosVisualizarModal:{
      padding:10,
      backgroundColor: '#fff',
      borderRadius: 20,
      // shadowColor: '#000',
      // shadowOffset: { width: 2, height: 4 },
      // shadowOpacity: 0.12,
      // shadowRadius: 5,
      // elevation: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 3,
      borderWidth:1,
      borderColor: '#ccc',
  },


  openButton: {
      backgroundColor: '#4CAF50',
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    closeButton:{
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      width: 100,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexButoes:{
      flexDirection: 'row',
      justifyContent:'flex-start',
      margin: 15,
      width: '100%',
      columnGap: '10',
    },
    titledESPESAS:{
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      margin: 15,
    },
    buttonUdate:{
      width: '25%',
      backgroundColor: '#4CAF50',
      padding: 5,
      borderRadius: 10,
      marginBottom: 10,
      marginLeft: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleMissioa:{
      fontSize: 20,
      fontWeight: 'bold',
      // marginBottom: 10,
      // marginLeft: 15,
      color: '#FFFFFF',
    },
    titleMisiContr:{
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      // marginLeft: 15,
      marginTop: 5,
      color: '#FFFFFF',
    },
    buttonTerminarMissao:{
      width: '100%',
      // backgroundColor: '#4CAF50',
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 10,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth:1,
      borderColor: '#ccc',
    }
});
