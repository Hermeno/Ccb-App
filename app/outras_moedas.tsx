import React,  { useEffect, useState } from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarCredito } from '@/services/credito';
import { useJwt } from './jwt';


 

export default function App ()
{
    const router = useRouter();
    const  user = useJwt(); 
    const back = () => {
        router.back();
    }
    const [creditos, setCreditos] = useState([]);
    useEffect(() => {
        const caregarCreditoa = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const data = await buscarCredito(token);            
            setCreditos(data || []);
          } catch (error) {
            console.error('Erro ao buscar despesas:', error);
          }
        };
      
        caregarCreditoa();
      }, []);

    return (
        // <ScrollView   >
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {(creditos || []).length > 0 ? (
                    creditos.map((credito) => (
                            <TouchableOpacity key={credito.id}  style={styles.cardInfo}>
                                    {/* <Text style={styles.Textshow}>{credito.referencia}</Text> */}
                                    <Text style={styles.Textshow}>Saldo em {credito.moeda}</Text>
                                    <Text style={styles.text_saldo}>Valor: R$: {credito.valor}</Text>
                            </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nenhuma Moeda encontrada</Text>
                )}
            </View>
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
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    content:{
        padding: 10,
        width: '100%',
        backgroundColor: '#fff',
        marginBottom: 100,
        // height: 70,
    },
    cardInfo:{
        margin: 30,
        backgroundColor: '#fff',
        // borderRadius: 15,
        // shadowColor: '#000',
        // shadowOffset: { width: 2, height: 4 },
        // shadowOpacity: 0.12,
        // shadowRadius: 5,
        // elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
        // padding:10,
        color: '#fff',
        borderWidth:1,
        borderColor: '#ccc',
        textAlign: 'center',
    },
    cardInfoOut:{
        margin: 10,
        backgroundColor: '#E25822',
        borderRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 0,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        color: '#fff',
        marginTop:50,
    },    
    Textshow:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
        // marginTop: 10,
        // borderWidth: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        width:'100%',
        backgroundColor: '#ccc',
        alignItems: 'center',
        textAlign: 'center',
        padding: 30,
        // borderTopLeftRadius: 15,
        // borderTopRightRadius: 15,
        height:100,
    },
    text_saldo:{
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000',
        margin: 10,
        height: 100,
        
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
    emptyText:{
        marginTop: 20,
        textAlign: 'center',
        color: '#FF0000',
        fontSize: 20,
        fontWeight: 'bold'
    }
})