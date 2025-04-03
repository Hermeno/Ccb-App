import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { cadastrarUsuario } from '../services/user'; 
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';  // Importa os ícones

export default function SignUp() {
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await cadastrarUsuario({
                user,
                name,
                email,
                password
            });
            if (response.status === 201) {
                Alert.alert('Cadastro realizado com sucesso!');
                router.replace('/');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('Erro ao cadastrar usuário');
            } else {
                Alert.alert('Erro inesperado ao se comunicar com o servidor');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>CRIE UMA CONTA</Text>
            <View style={styles.CardLogin}>
                
                {/* Nome */}
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={20} color="#121212" style={styles.icon} />
                    <TextInput 
                        value={name} 
                        onChangeText={setName} 
                        style={styles.input} 
                        placeholder="Seu nome completo"
                    />
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={20} color="#121212" style={styles.icon} />
                    <TextInput 
                        value={email} 
                        onChangeText={setEmail} 
                        style={styles.input} 
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Senha */}
                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={20} color="#121212" style={styles.icon} />
                    <TextInput 
                        value={password} 
                        onChangeText={setPassword} 
                        style={styles.input} 
                        secureTextEntry 
                        placeholder="******"
                    />
                </View>

                <TouchableOpacity style={styles.BotaoLogin} onPress={handleSignUp}>
                    <Text style={styles.TextBotao}>Cadastrar</Text>
                </TouchableOpacity>

                <View style={styles.containerLines}>
                    <View style={styles.line} />
                    <Text style={styles.text}>Ou</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.TextRecuperarSenha}>
                    <Text style={{ color: "#24991d", fontWeight: 'bold' }}>
                        Já possui uma conta?  
                        <Text style={{ color: "#00835f", fontSize: 17 }}>
                            <Link href="/"> Entre </Link>
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    TextHeaderLogin: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#121212",
        textAlign: "left",
    },
    CardLogin: {
        width: 330,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: "#fafafa",
        width: "100%",
        marginBottom: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        height: 50,
        fontSize: 16,
    },
    icon: {
        marginRight: 10,
    },
    BotaoLogin: {
        width: "100%",
        height: 50,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    TextRecuperarSenha: {
        color: "#121212",
        fontSize: 16,
        fontWeight: "500",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        padding: 5,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        height:100,
    },
    TextBotao: {
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
        backgroundColor: '#00835f',
        flex: 1,
    },
    text: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});

