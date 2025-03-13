import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView , Platform, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from './jwt';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import  {buscarDespesas} from '../services/despesas'

const { height } = Dimensions.get('window');
 
export default function Home() {
    const  user = useJwt();  
    const router = useRouter();
    const [dispesas, setDespesas] = useState([]);
    useEffect(() => {
        const caregarDespesas = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const data = await buscarDespesas(token);            
            setDespesas(data || []);
          } catch (error) {
            console.error('Erro ao buscar despesas:', error);
          }
        };
      
        caregarDespesas();
      }, []);


    const back = () => {
        router.back();
    }
    const DESPESAS = (despesa_id: number, despesa_name: string) => {
        router.push({
            pathname: './despesas',
            params: { despesa_id, despesa_name }
        });
    };
    

    return (
        <View style={styles.container}>
        <ScrollView>
        {(dispesas || []).length > 0 ? (
            dispesas.map((despesa) => (
                <View key={despesa.id} style={styles.card}>
                    <View style={styles.cardInfoFirstLeft}>
                    <Text style={styles.title}>
                    {Array.isArray(despesa.descricao) && despesa.descricao.length > 0 
                        ? despesa.descricao.join(', ') 
                        : despesa.outro}
                    </Text>
                    <Text>Data: {despesa.data_padrao ? new Date(despesa.data_padrao).toLocaleDateString() : 'Sem data'}</Text>
                    <Text>Moeda: {despesa.moeda}</Text>
                    <Text>Valor: {despesa.valor}</Text>
                    <Text>Número do Recibo: {despesa.numero_recibo}</Text>
                    <Text>Missão: {despesa.missao_name}</Text>
                    </View>
                    <View style={styles.cardInfoFirstRight}>
                        <TouchableOpacity style={styles.butonsdespesasVisualizar}><Text>ver e editar</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.butonsdespesasVisualizar} onPress={() => DESPESAS(despesa.id, despesa.descricao)}><Text>Cadastrar despesas</Text></TouchableOpacity>
                    </View>
                </View>
            ))
        ) : (
            <Text style={styles.emptyText}>Nenhuma despesa encontrada</Text>
        )}
        </ScrollView>
        <View style={styles.footer}>
            
            <TouchableOpacity onPress={back} style={{marginLeft:10}}>
            <MaterialIcons name="arrow-back-ios" size={20} color="blue" />
            </TouchableOpacity>


            <TouchableOpacity style={styles.profile}>
            <FontAwesome name="user-o" size={20} color="blue" />
            </TouchableOpacity>
        </View>
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
    },
    cardInfoFirstRight:{
        width: '30%',
        // height: 80,
        backgroundColor: '#a2564a',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
    },
    butonsdespesasVisualizar:{
        padding:10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        color: '#a2564a',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    footer: {
        position: 'absolute', // Fixa o footer
        bottom: 0,            // Cola no rodapé
        width: '100%',        // Ocupa a largura toda
        height: 70,           // Altura mínima de 70
        backgroundColor: '#fafafa',
        // borderTopWidth: 1,
        // borderTopColor: '#ccc',
        alignItems: 'center',
        zIndex: 1,  // Garantir que o footer esteja acima da Animated View
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        padding:10,
    },
    profile:{
        width: 100,
        height: 50,
        backgroundColor: '#a2564a',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        padding: 10,
        marginBottom: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },  
});
