import React,  { useState, useEffect} from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import { useJwt } from './jwt';
import { MaterialIcons } from '@expo/vector-icons';
export default function HomeScreen ()
{
    const router = useRouter();
    const user = useJwt();
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
            <ScrollView showsVerticalScrollIndicator={false}>
                    {/* {user ? (
                        <View style={styles.header}>
                            <Text style={styles.Textshow}>Ola, {user.name}</Text>
                        </View>
                    ) : (
                        <Text>Faca Login...</Text>
                    )} */}
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.cardInfo} onPress={sendOutraMoedas}>
                            <Text style={styles.Textshow}>Outras Moedas</Text>
                            <Text><Link href="/outras_moedas"> <MaterialIcons name="arrow-forward" size={50} color="blue" /></Link></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo} onPress={CREDITO}>
                            <Text style={styles.Textshow}>Credito</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={50} color="blue" /></Link></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo} onPress={CAMBIO}>
                            <Text style={styles.Textshow}>Cambio</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={50} color="blue" /></Link></Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo} onPress={MISSAO}>
                            <Text style={styles.Textshow}>Missao</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={50} color="blue" /></Link></Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo} onPress={DESPESA}>
                            <Text style={styles.Textshow}>Despesas</Text>
                            <Text><Link href="/"> <MaterialIcons name="arrow-forward" size={50} color="blue" /></Link></Text>
                        </TouchableOpacity> 
                        <TouchableOpacity style={styles.cardInfoOut}>
                            <Text style={styles.Textshow}>Sair</Text>
                            <Text><Link href="/"> <MaterialIcons name="logout" size={50} color="red" /></Link></Text>
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
        backgroundColor: '#fafafa'
    },
    content:{
        padding: 10,
        width: '100%',
        backgroundColor: '#fafafa',
    },
    cardInfo:{
        margin: 10,
        backgroundColor: '#dddddd',
        // alignItems: 'center',
        padding:20,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardInfoOut:{
        margin: 10,
        backgroundColor: '#DDD',
        // alignItems: 'center',
        padding:20,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    Textshow:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#00835f'
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
    }
})