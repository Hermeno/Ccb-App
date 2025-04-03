import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { buscarCreditos } from '../services/despesas';
import { atualizarCambio, buscarCambioPorId } from '../services/cambio';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdatePage() {
    const router = useRouter();
    const { missao_id, missao_name  } = useLocalSearchParams(); // missao_id do câmbio a ser atualizado
    const [cotacao, setCotacao] = useState('');
    const [moeda_origem, setMoeda_origem] = useState('');
    const [moeda_destino, setMoeda_destino] = useState('');
    const [total_a_cambiar, setTotal_a_cambiar] = useState('');
    const [total_cambiado, setTotal_cambiado] = useState('');
    const [numero_recibo, setNumero_recibo] = useState('');
    const [creditos, setCreditos] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');

                // Buscar créditos disponíveis
                const data = await buscarCreditos(token);
                setCreditos(data);

                // Carregar os valores existentes do câmbio
                const cambio = await buscarCambioPorId(missao_id, token);
                setMoeda_origem(cambio.moeda_origem);
                setMoeda_destino(cambio.moeda_destino);
                setCotacao(String(cambio.cotacao));
                setTotal_a_cambiar(String(cambio.total_a_cambiar));
                setTotal_cambiado(String(cambio.total_cambiado));
                setNumero_recibo(cambio.numero_recibo);

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        carregarDados();
    }, [missao_id]);

    const handleUpdate = async () => {
        if (!moeda_origem || !moeda_destino || !cotacao || !total_a_cambiar || !numero_recibo || !missao_id) {
            Alert.alert( 'Todos os campos precisam ser preenchidos.');
            return;
        }
    
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await atualizarCambio(
                missao_id,
                {
                    moeda_origem,
                    moeda_destino,
                    cotacao,
                    total_a_cambiar,
                    total_cambiado,
                    numero_recibo,
                    missao_id // ✅ Adicionando missao_id aqui
                },
                token
            );
    
            if (response.status === 200) {
                Alert.alert('Sucesso', 'Câmbio atualizado com sucesso!');
                router.replace(`/home?missao_id=${missao_id}&missao_name=${missao_name}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar câmbio:', error);
            Alert.alert( 'Não foi possível atualizar o câmbio.');
        }
    };
    
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#FFF' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                Atualizar Câmbio
            </Text>

            {/* Moeda de origem */}
            <Text style={styles.label}>Moeda de Origem:</Text>
            <Picker selectedValue={moeda_origem}onValueChange={(itemValue) => setMoeda_origem(itemValue)}  >
                <Picker.Item label="Selecione uma moeda de origem..." value="" />
                {creditos.map((credito) => (
                    <Picker.Item key={credito.id} label={`${credito.moeda}`} value={credito.moeda} />
                ))}
            </Picker>

            {/* Moeda de destino */}
            <Text style={styles.label}>Moeda de Destino:</Text>
            <Picker
                selectedValue={moeda_destino}
                onValueChange={(itemValue) => setMoeda_destino(itemValue)}
            >
                <Picker.Item label="Selecione uma moeda de destino..." value="" />
                <Picker.Item label="Dólar" value="dolar" />
                <Picker.Item label="Real" value="real" />
                <Picker.Item label="Metical" value="metical" />
                <Picker.Item label="Euro" value="euro" />
                <Picker.Item label="Libra" value="libra" />
                <Picker.Item label="Iene" value="iene" />
            </Picker>

            {/* Cotação */}
            <Text style={styles.label}>Cotação:</Text>
            <TextInput
                value={cotacao}
                onChangeText={setCotacao}
                style={styles.input}
                placeholder="Cotação"
                keyboardType="numeric"
            />

            {/* Total a Cambiar */}
            <Text style={styles.label}>Total a Cambiar:</Text>
            <TextInput
                value={total_a_cambiar}
                onChangeText={setTotal_a_cambiar}
                style={styles.input}
                placeholder="Total a Cambiar"
                keyboardType="numeric"
            />

            {/* Total Cambiado */}
            <Text style={styles.label}>Total Cambiado:</Text>
            <TextInput
                value={total_cambiado}
                onChangeText={setTotal_cambiado}
                style={styles.input}
                placeholder="Total Cambiado"
                keyboardType="numeric"
            />

            {/* Número de Recibo */}
            <Text style={styles.label}>Número de Recibo:</Text>
            <TextInput
                value={numero_recibo}
                onChangeText={setNumero_recibo}
                style={styles.input}
                placeholder="Número de Recibo"
            />

            {/* Botão para atualizar */}
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Atualizar Câmbio</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#121212',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#00835f',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
  