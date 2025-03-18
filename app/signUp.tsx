import React, { useState } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';
import { cadastrarUsuario } from '../services/user'; 



export default function SignUp () 
{
    const  [name, setName] = useState('');
    const  [user, setUser] = useState('');
    const  [email, setEmail] = useState(''); 
    const  [password, setPassword] = useState('');
    const handleSignUp = async () => {
        try {
            const response = await cadastrarUsuario({
                user,
                name,
                email,
                password
            });

            console.log(response.data);
            console.log(response); 

            if (response.status === 201) {
                Alert.alert('Cadastro realizado com sucesso!');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar usuário');
            } else {
                Alert.alert('Erro', 'Erro inesperado ao se comunicar com o servidor');
            }
        }
    };
    return(
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>CRIE UMA CONTA</Text>
            <View style={styles.CardLogin}>                
                {/* <Text style={styles.TextInput}>Usuario</Text>
                <TextInput value={user} onChangeText={setUser} style={styles.input} placeholder='nome do usuario'/> */}

                <Text style={styles.TextInput}>USUARIO</Text>
                <TextInput value={name} onChangeText={setName} style={styles.input} placeholder='seu nome completo'/>

                <Text style={styles.TextInput}>EMAIL</Text>
                <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder='email'/>

                <Text style={styles.TextInput}>PASSWORD</Text>
                <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry={true} placeholder='******'/>

                <TouchableOpacity style={styles.BotaoLogin} onPress={handleSignUp}>
                    <Text style={styles.TextBotao}>Login</Text>
                </TouchableOpacity>

                <View style={styles.containerLines}>
                    <View style={styles.line} />
                    <Text style={styles.text}>Or</Text>
                    <View style={styles.line} />
                </View>


                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>
                        Ja possui uma conta ? 
                        <Text  style={{color:"#00835f", fontSize:17}}><Link href="/"> Entre </Link></Text>
                    </Text>
                </View>
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