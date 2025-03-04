import React,  { useState, useEffect} from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App ()
{
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);




    const router = useRouter();
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
                <View style={styles.header}>
                    {/* <Image source={require('../assets/logo.png')} style={{width: 100, height: 100}} /> */}
                    <Text style={styles.Textshow}>Seja bem vindo, {userId}</Text>
                </View>
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