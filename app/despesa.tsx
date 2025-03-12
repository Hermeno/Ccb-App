import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView , Platform, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from './jwt';
import  {buscarDespesas} from '../services/despesas'

const { height } = Dimensions.get('window');

export default function Home() {
    const  user = useJwt();  
    const router = useRouter();
    const [despesas, setDespesas] = useState([]);
    useEffect(() => {
        const buscarDespesas = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const data = await buscarDespesas(token);            
            setDespesas(data || []); // Garante que despesas será um array vazio caso data seja undefined
          } catch (error) {
            console.error('Erro ao buscar missões:', error);
          }
        };
      
        buscarDespesas();
      }, []);


    const back = () => {
        router.back();
    }
    const DESPESAS = (missao_id: number, missao_name: string) => {
        router.push({
            pathname: './despesas',
            params: { missao_id, missao_name }
        });
    };
    

    return (
        <View style={styles.container}>
        <ScrollView>
        {(despesas || []).length > 0 ? (
            despesas.map((missao) => (
                <View key={missao.id} style={styles.card}>
                    <View style={styles.cardInfoFirstLeft}>
                        <Text style={styles.title}>{missao.missao}</Text>
                        <Text>Início: {new Date(missao.data_inicio_prevista).toLocaleDateString()}</Text>
                        <Text>País: {missao.pais}</Text>
                    </View>
                    <View style={styles.cardInfoFirstRight}>
                        <TouchableOpacity style={styles.butonsMissaosVisualizar}><Text>ver e editar</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.butonsMissaosVisualizar} onPress={() => DESPESAS(missao.id, missao.missao)}><Text>Cadastrar despesas</Text></TouchableOpacity>
                    </View>
                </View>
            ))
        ) : (
            <Text style={styles.emptyText}>Nenhuma missão encontrada</Text>
        )}
        </ScrollView> 
        </View>
 )           
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // alignItems: "center",
        justifyContent: 'flex-end',  // Garante que o conteúdo vai para o fundo da tela
    },
    
    card: {
        marginBottom: 10,
        backgroundColor: '#fafafa',
        borderRadius: 10,
        // padding: 16,
        flexDirection: 'row',
        justifyContent:'space-between',
        margin:10,
        // borderWidth: 1,
        borderColor: '#ccc',
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    emptyText:{
        textAlign: 'center',
        marginTop: 20,
    }
});
