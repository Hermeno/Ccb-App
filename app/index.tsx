import React,  { } from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, Router  } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App ()
{
    return (
        // <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
            {/* <View style={styles.header}>
                <Link >
                    <Image 
                        source={require('../assets/back-arrow.png')} // Coloque sua seta aqui (imagem PNG)
                        style={styles.backIcon}
                    />
                </Link>
            </View> */}
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>Outras Moedas</Text>
                            <Link href="/">About</Link>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>Credito</Text>
                            <Link href="/">About</Link>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>Cambio</Text>
                            <Link href="/">About</Link>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo}>
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
                </View>  
            </ScrollView>  
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fabc48'
    },
    content:{
        flex: 1,
        padding: 10,
        width: '100%',
        backgroundColor: '#fff',
    },
    cardInfo:{
        margin: 10,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Textshow:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    }
})