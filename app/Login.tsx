import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api  from './services/api';  // Assumindo que o axios está configurado aqui

export default function User() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Recuperar o token JWT do AsyncStorage
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    // Configurar o token no cabeçalho das requisições API
                    api.defaults.headers['Authorization'] = `Bearer ${token}`;

                    // Obter dados do usuário ou qualquer outro dado privado
                    const response = await api.get('/user');  // Endpoint protegido
                    setUser(response.data); // Suponha que a resposta seja os dados do usuário
                } else {
                    Alert.alert('Erro', 'Usuário não autenticado');
                    // Redirecionar para a tela de login
                }
            } catch (error) {
                console.error('Erro ao carregar os dados do usuário', error);
                Alert.alert('Erro', 'Erro ao carregar os dados do usuário');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View>
            {user ? (
                <Text>Bem-vindo, {user.name}</Text>
            ) : (
                <Text>Falha ao carregar os dados do usuário</Text>
            )}
        </View>
    );
}
