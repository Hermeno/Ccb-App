import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarCredito } from '@/services/credito';
import { useJwt } from './jwt';

export default function App() {
  const router = useRouter();
  const user = useJwt(); 

  const [creditos, setCreditos] = useState([]);

  useEffect(() => {
    const carregarCredito = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarCredito(token);
        setCreditos(data || []);
      } catch (error) {
        console.error('Erro ao buscar créditos:', error);
      }
    };

    carregarCredito();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Saldo Disponível</Text>

        {creditos.length > 0 ? (
          creditos.map((credito) => (
            <TouchableOpacity key={credito.id} style={styles.card}>
              <Text style={styles.cardTitle}>Saldo em {credito.moeda}</Text>
              <Text style={styles.cardAmount}>R$ {credito.valor}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma moeda encontrada</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#FF0000',
    marginTop: 20,
  },
});

