import React,  { } from 'react';
import { View, Text,StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, Router  } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App ()
{
    return (
        // <ScrollView   >
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                {/* </View>   */}
            </ScrollView>  
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff'
    },
    content:{
        // flex: 1,
        padding: 10,
        width: '100%',
        backgroundColor: '#fff',
    },
    cardInfo:{
        margin: 10,
        // padding: 20,
        backgroundColor: '#fafafa',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 180,
    },
    Textshow:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333'
    }
})