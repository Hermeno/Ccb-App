import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { token } = useLocalSearchParams<{ token: string }>(); // Pega o token da URL
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        // Verifique o deep link quando o app for aberto com um link de redefinição de senha
        const handleDeepLink = ({ url }) => {
            const route = url.replace(/.*?:\/\//g, ''); // Pega a URL depois do esquema
            if (route.startsWith('redefinir-senha')) {
                // Aqui você pode extrair o token, se necessário, ou fazer qualquer outra ação
                console.log('Link de redefinir senha', route);
            }
        };

        Linking.addEventListener('url', handleDeepLink);

        return () => {
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, []);

    const handleResetPassword = async () => {
        try {
            const response = await fetch('http://192.168.43.226:3000/redefinir-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Sucesso', 'Senha redefinida com sucesso');
                router.replace('/');
            } else {
                Alert.alert('Erro', data.error || 'Erro ao redefinir senha');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Erro ao redefinir senha');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Redefinir Senha</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Redefinir Senha</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
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
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#00835f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
