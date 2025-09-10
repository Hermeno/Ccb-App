import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { buscarMissaoPorId } from '../services/missao';

const { height } = Dimensions.get('window');

export default function MissaoPage() {
  const router = useRouter();
  const { missao_id, missao_name } = useLocalSearchParams();
  const [missao, setMissao] = useState(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
        const carregarMissao = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token && missao_id) {
            const dados = await buscarMissaoPorId(missao_id, token);
           
            setMissao(Array.isArray(dados) ? dados[0] : dados);
            }
        } catch (error) {
            console.error('Erro ao carregar missão:', error);
        } finally {
            setLoading(false);
        }
        };


    carregarMissao();

    Animated.timing(slideAnim, {
      toValue: height / 100, // Aparece da metade inferior
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);



    const Update = (missao_id: string, missao_name: string) => {
        router.push({
            pathname: '/updatemissao', // caminho correto
            params: { missao_id, missao_name }
        });
    };







  return (
    <View style={styles.container}>
      {/* Conteúdo do fundo da tela */}
      <Text style={styles.tituloCabecalho}>{missao_name}</Text>
      {/* <Text style={styles.tituloCabecalho}>Missão: {missao_name}</Text> */}

      {/* Detalhes da missão que sobem do rodapé */}
      <Animated.View style={[styles.cardAnimado, { transform: [{ translateY: slideAnim }] }]}>
        {missao ? (
          <View style={styles.card}>
            <Text style={styles.label}>Missão:</Text>
            <Text style={styles.value}>{missao.missao}</Text>

            <Text style={styles.label}>País:</Text>
            <Text style={styles.value}>{missao.pais}</Text>

            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.value}>{missao.estado}</Text>

            <Text style={styles.label}>Cidade:</Text>
            <Text style={styles.value}>{missao.cidade}</Text>

            <Text style={styles.label}>Início:</Text>
            <Text style={styles.value}>{new Date(missao.data_inicio_prevista).toLocaleDateString()}</Text>

            <Text style={styles.label}>Final:</Text>
            <Text style={styles.value}>{new Date(missao.data_final_prevista).toLocaleDateString()}</Text>


            <TouchableOpacity style={styles.butonsMissaosVisualizar} onPress={() => Update(missao.id, missao.missao)}>
                <Text>Atualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.loading}>Carregando missão...</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#487d76',
    paddingTop: 50,
    alignItems: 'center',
  },
  tituloCabecalho: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardAnimado: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.80,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  card: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  loading: {
    fontSize: 16,
    color: '#333',
  },
      butonsMissaosVisualizar:{
        padding:10,
        backgroundColor: 'transparent',
        borderRadius: 10,

        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth:0.8,
        borderColor: '#ccc',
        marginBottom:5
    },
});
