import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function ForgetPasswordScreen() {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await fetch('https://api-com-nodejs-express-mongodb-prisma.onrender.com/esqueci-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Sucesso', 'Email de recuperação enviado');
            } else {
                Alert.alert('Erro', data.error || 'Erro ao enviar email');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Erro ao enviar solicitação');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Senha</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20,
        justifyContent: 'center',
        alignItems: "center",
    },




  containerForm: {
    flex: 2,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    width: "100%",
  },


    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        width: "75%",
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#00835f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: "75%",
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
