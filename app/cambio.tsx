import React, { useState } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter  } from 'expo-router';

export default function Home () 
{
    const router = useRouter();

    return(
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>Esqueceu a senha ?, escreva seu email</Text>
            <View style={styles.CardLogin}>                
                <Text style={styles.TextInput}>Email</Text>
                {/* <TextInput  value={} onChangeText={} style={styles.input} placeholder='Email do usuario' /> */}
                <TouchableOpacity style={styles.BotaoLogin}>
                    <Text style={styles.TextBotao}>Login</Text>
                </TouchableOpacity>

                <View style={styles.containerLines}>
                    <View style={styles.line} />
                        <Text style={styles.text}>Or</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>Logar na sua conta!  
                        <Text  style={{color:"#00835f", fontSize:17}}><Link href="/"> Sign-In</Link></Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#487d76",
        justifyContent: "center",
        alignItems: "center",
    },
    TextHeaderLogin:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 30,
        height: 120,
        paddingTop: 40,
    },
    CardLogin:{
        width: '100%',
        // height: 400,
        flex:1,
        backgroundColor: "#ffffff",
        // borderRadius: 30,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        borderTopEndRadius: 40,
        borderTopStartRadius: 40,
    },
    input:{
        marginBottom: 10,
        // padding: 10,
        borderBottomWidth: 2,
        borderColor: "#ccc",
        width: "95%",
        color:"#121212"
    },
    TextInput:{
        marginBottom: 10,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
    },


    BotaoLogin:{
        width: "100%",
        height: 40,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
    },
    TextNaoPossuiConta:{
        marginTop: 20,
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "500",

    },
    TextRecuperarSenha:{
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "500",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 5,
        width: "100%",
        height: "15%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 20,
    },
    LinkRecuperarSenha:{
        justifyContent: "center",
        alignItems: "center", 
        color: "#ffffff"      
    },
    TextBotao:{
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "bold",
    },
    containerLines: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    line: {
        height: 1,
        backgroundColor: '#00835f',  // Cor da linha
        flex: 1,  // Isso faz a linha ocupar o espaço restante
    },
    text: {
        marginHorizontal: 10,  // Espaçamento entre o texto e as linhas
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',  // Cor do texto
    },
})