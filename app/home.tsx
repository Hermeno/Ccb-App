import React,  { useState, useEffect} from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import { useJwt } from './jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarCreditoLimit } from '@/services/credito';
import { MaterialIcons } from '@expo/vector-icons';
export default function HomeScreen ()
{
    const router = useRouter();
    const user = useJwt();
    const [creditos, setCreditos] = useState([]);

useEffect(() => {
  const carregarCredito = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = await buscarCreditoLimit(token);
      console.log(data);
      // Se for um array, usa diretamente; se for um objeto, transforma em array
      setCreditos(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error('Erro ao buscar créditos:', error);
    }
  };

  carregarCredito();
}, []);

  






    const sendOutraMoedas = () => {
        router.push('/outras_moedas');
    };
    const CREDITO = () => {
        router.push('/credito');
    };
    const CAMBIO = () => {
        router.push('/cambio');
    };
    const MISSAO = () => {
        router.push('/missao');
    };
    const DESPESA = () => {
        router.push('/despesa');
    };
    return (
        // <ScrollView   >
        <View style={styles.container}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}

                    
                    {creditos.length > 0 ? (
                    creditos.map((credito) => (
                        <TouchableOpacity key={credito.id} style={styles.card}>
                        <Text style={styles.title}>Saldo Disponível</Text>
                        <Text style={styles.title}>Em {credito.moeda}</Text>
                        <Text style={styles.title}>R$ {credito.valor}</Text>
                        </TouchableOpacity>
                    ))
                    ) : (
                    <Text style={styles.emptyText}>Nenhuma moeda encontrada</Text>
                    )}

                    <View style={styles.content}>
                        <TouchableOpacity style={styles.cardInfo} onPress={sendOutraMoedas}>
                            <Text style={styles.Textshow}>Outras Moedas</Text>
                            <Text><Link href="/outras_moedas"> <MaterialIcons name="arrow-forward" size={30} color="black" /></Link></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo} onPress={CREDITO}>
                            <Text style={styles.Textshow}>Credito</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={30} color="black" /></Link></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo} onPress={CAMBIO}>
                            <Text style={styles.Textshow}>Cambio</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={30} color="black" /></Link></Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo} onPress={MISSAO}>
                            <Text style={styles.Textshow}>Missao</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={30} color="black" /></Link></Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo} onPress={DESPESA}>
                            <Text style={styles.Textshow}>Despesas</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={30} color="black" /></Link></Text>
                        </TouchableOpacity> 
                        <TouchableOpacity style={styles.cardInfoOut}>
                            <Text style={styles.Textshow}>Sair</Text>
                            <Text><Link href="/"> <MaterialIcons name="logout" size={30} color="red" /></Link></Text>
                        </TouchableOpacity>                 
                    </View>
                {/* </View>   */}
            {/* </ScrollView>   */}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#487d76'
    },
    content:{
        padding: 10,
        width: '100%',
        backgroundColor: '#fafafa',
        bottom: 0,
        position: 'absolute',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: '85%',
    },
    cardInfo:{
        margin: 10,
        backgroundColor: 'transparent',
        // alignItems: 'center',
        padding:20,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius:10,
    },
    cardInfoOut:{
        margin: 10,
        backgroundColor: 'transparent',
        // alignItems: 'center',
        padding:20,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        borderRadius:10,
    },
    Textshow:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00835f',
        // margin: 10,

    },
    header:{
        backgroundColor: '#00835f',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 180,
        color: '#fff',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
    },
    // card:{
    //     margin: 10,
    //     backgroundColor: '#dddddd',
    //     padding: 20,
    //     color: '#fff',
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent:'space-between',
    //     marginBottom: 10
    // },
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
        color: '#fff'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#fff',
    }
})