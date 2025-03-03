import React,  { } from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter  } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App ()
{
    const router = useRouter();
    const back = () => {
        router.back();
    }
    return (
        // <ScrollView   >
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM REAIS</Text>
                            <Text style={styles.text_saldo}>R$: 981,00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM DOLAR</Text>
                            <Text style={styles.text_saldo}>U$: 125,00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM EURO</Text>
                            <Text style={styles.text_saldo}>E$: 3312,00</Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM METICAIS</Text>
                            <Text style={styles.text_saldo}>MZN$: 1300,00</Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM LIBRAS</Text>
                            <Text style={styles.text_saldo}>EL$: 97,99</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity style={styles.cardInfoOut} onPress={back}>
                            <Text style={styles.Textshow}>Voltar</Text>
                        </TouchableOpacity>                 
                    </View>
                {/* </View>   */}
            </ScrollView>  
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
    },
    cardInfo:{
        margin: 10,
        backgroundColor: '#00835f',
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
    },
    cardInfoOut:{
        margin: 10,
        backgroundColor: '#E25822',
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
    Textshow:{
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff'
    },
    text_saldo:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4ac578'
    }
})