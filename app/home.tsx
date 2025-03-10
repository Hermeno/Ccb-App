import React,  { useState, useEffect} from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import { useJwt } from './jwt'
export default function App ()
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
    return (
        // <ScrollView   >
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                    {user ? (
                        <View style={styles.header}>
                            <Text style={styles.Textshow}>Seja bem vindo, {user.name} -- {user.id}</Text>
                        </View>
                    ) : (
                        <Text>Faca Login...</Text>
                    )}
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.cardInfo} onPress={sendOutraMoedas}>
                            <Text style={styles.Textshow}>Outras Moedas</Text>
                            <Link href="/outras_moedas">About</Link>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo} onPress={CREDITO}>
                            <Text style={styles.Textshow}>Credito</Text>
                            <Link href="/">About</Link>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo} onPress={CAMBIO}>
                            <Text style={styles.Textshow}>Cambio</Text>
                            <Link href="/">About</Link>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo} onPress={MISSAO}>
                            <Text style={styles.Textshow}>Missao</Text>
                            <Link href="/">About</Link>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>Despesas</Text>
                            <Link href="/">About</Link>
                        </TouchableOpacity> 
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>Sair</Text>
                            <Link href="/">About</Link>
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
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 180,
        color: '#fff',
    },
    Textshow:{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff'
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