import React, { useState } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/user'; 
import { jwtDecode } from "jwt-decode";





export default function Home () 
{
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    type MyTokenPayload = {
        id: string,
        iat: number,
        exp: number,
    }
    const handleLogin = async () => {
        try {
            const token = await loginUsuario({ email, password });
            if (token) {
                await AsyncStorage.setItem('userToken', token);
                const decodedToken = jwtDecode<MyTokenPayload>(token);
                const id = await AsyncStorage.setItem('userId', decodedToken.id);  
                Alert.alert("Logado com sucesso");
                router.replace('/home'); 
            } else {
                router.replace('/');
            }
        } catch (error) {
            Alert.alert('Credenciais inválidas ou erro ao fazer login');
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>Esqueceu a senha?</Text>
            <View style={styles.CardLogin}>                
                <Text style={styles.TextInput}>INFORME SEU EMAIL</Text>
                <TextInput  value={email} onChangeText={setEmail} style={styles.input} placeholder='Email do usuario' />
                <TouchableOpacity style={styles.BotaoLogin} onPress={handleLogin}>
                    <Text style={styles.TextBotao}>ENVIAR</Text>
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
                {/* <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>Esqueceu a senha? 
                    <Text  style={{color:"#00835f", fontSize:17}}><Link href="/home"> Recuperar </Link></Text>
                    </Text>
                </View> */}



            </View>
        </View>
    );
}


const styles = StyleSheet.create({
 

    container:{
        flex:1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    TextHeaderLogin:{
        fontSize: 30,
        fontWeight: "bold",
        color: "#121212",
        alignItems: "center",
        textAlign: "left",
        // marginTop: -130,
        width: '80%',
    },
    CardLogin:{
        width: 330,
        justifyContent: "center",
        alignItems: "center",
        marginTop:10
    },
    input:{
        marginBottom: 10,
        // borderBottomWidth: 2,
        borderWidth: 1,

        borderColor: "#ccc",
        width: "100%",
        borderRadius: 20,
        padding: 10,
        height: 50,
        backgroundColor: "#fafafa"
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
        height: 50,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    TextNaoPossuiConta:{
        marginTop: 20,
        color: "#121212",
        fontSize: 18,
        fontWeight: "500",

    },
    TextRecuperarSenha:{
        color: "#121212",
        fontSize: 16,
        fontWeight: "500",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
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
        color: "#24991d"      
    },
    TextBotao:{
        color: "#fff",
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