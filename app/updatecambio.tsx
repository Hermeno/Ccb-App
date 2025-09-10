import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { buscarCreditos } from '../services/despesas';
import { atualizarCambio, buscarCambioPorId } from '../services/cambio';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdatePage() {
    const router = useRouter();
    const [cotacao, setCotacao] = useState('');
    const [moeda_origem, setMoeda_origem] = useState('');
    const [moeda_destino, setMoeda_destino] = useState('');
    const [total_a_cambiar, setTotal_a_cambiar] = useState('');
    const [total_cambiado, setTotal_cambiado] = useState('');
    const [numero_recibo, setNumero_recibo] = useState('');
    const [creditos, setCreditos] = useState([]);

    const [missaoId, setMissaoId] = useState<string | null>(null);
    const [missaoName, setMissaoName] = useState('');  
    const params = useLocalSearchParams();
    const id_post = params.id_post as string; // ID do câmbio a ser atualizado
     const {   missao_id, missao_name, idCambio } = useLocalSearchParams();





    useEffect(() => {
        const fetchCambios = async () => {
            try {   
                const token = await AsyncStorage.getItem('userToken');
                const response = await buscarCambioPorId(idCambio, token, missaoId);
                if (response) {
                    setMoeda_origem(response.moeda_origem);
                    setMoeda_destino(response.moeda_destino);

                    // Multiplicar cotacao, total_a_cambiar, total_cambiado por 100 para converter para porcentagem
                    // setValor((data.valor / 100).toFixed(2).replace('.', ','));
                    setCotacao((response.cotacao / 100).toString());
                    setTotal_a_cambiar((response.total_a_cambiar / 100).toString());
                    setTotal_cambiado((response.total_cambiado / 100).toString());  
                    setNumero_recibo(response.numero_recibo);
                    setMissaoId(response.missao_id);
                }else{
                    console.log('Resposta vazia ao buscar câmbio por ID');
                }
            } catch (error) {
                console.error('Erro ao buscar créditos:', error);
            }
        };
        fetchCambios();
    }, [missao_id]);



    //           function parseValor(valor: string) {
            //     if (valor.includes(',')) {
            //       return Number(valor.replace(/\./g, '').replace(',', '.'));
            //     }
            //     return Number(valor);
            //   }
            //   const valorNumerico = parseValor(valor);
            //   if (isNaN(valorNumerico)) {
            //     Alert.alert('Valor numérico inválido. Use apenas números e vírgulas para decimais.');
            //     return;
            //   }


    const handleUpdate = async () => {
        const token = await AsyncStorage.getItem('userToken');

        if (!cotacao || !moeda_origem || !moeda_destino || !total_a_cambiar || !total_cambiado || !numero_recibo) {
            Alert.alert('Todos os campos precisam ser preenchidos.');
            return;
        }
        function parseValor(valor: string) {
            if (valor.includes(',')) {
              return Number(valor.replace(/\./g, '').replace(',', '.'));
            }

            return Number(valor);
            }
            const cotacaoNumerico = parseValor(cotacao);
            const total_a_cambiarNumerico = parseValor(total_a_cambiar);
            const total_cambiadoNumerico = parseValor(total_cambiado);
            if (isNaN(cotacaoNumerico) || isNaN(total_a_cambiarNumerico) || isNaN(total_cambiadoNumerico)) {
            Alert.alert('Valores numéricos inválidos. Use apenas números e vírgulas para decimais.');
            return;
            }
        try {
            await atualizarCambio(
                {
                    idCambio,
                    cotacao: cotacaoNumerico,
                    moeda_origem,
                    moeda_destino,
                    total_a_cambiar: total_a_cambiarNumerico,
                    total_cambiado: total_cambiadoNumerico,
                    numero_recibo,
                    missao_id: missaoId,
                },
                token
            );  
            Alert.alert('Sucesso!', 'Câmbio atualizado com sucesso!');
            router.replace(`/home`);
        } catch (error) {
            console.error('Erro ao atualizar câmbio:', error);
            Alert.alert('Não foi possível atualizar o câmbio.');
        }
    };









    
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#FFF' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                Atualizar Câmbio
            </Text>

            {/* Moeda de origem */}
            <Text style={styles.label}>Moeda de Origem:</Text>
            <TextInput
                value={moeda_origem }
                onChangeText={setMoeda_origem}
                style={styles.input}
                placeholder="Cotação"
                keyboardType="default"
                editable={false}
            />

            {/* Moeda de destino */}
            <Text style={styles.label}>Moeda de Destino:</Text>
            <TextInput
                value={moeda_destino}
                onChangeText={setMoeda_destino}
                style={styles.input}
                placeholder="Cotação"
                keyboardType="default"
                editable={false}
            />

            {/* Cotação */}
            <Text style={styles.label}>Cotação:</Text>
            <TextInput
                value={cotacao}
                onChangeText={setCotacao}
                style={styles.input}
                placeholder="Cotação"
                keyboardType="default"
            />

            {/* Total a Cambiar */}
            <Text style={styles.label}>Total a Cambiar:</Text>
            <TextInput
                value={total_a_cambiar}
                onChangeText={setTotal_a_cambiar}
                style={styles.input}
                placeholder="Total a Cambiar"
                keyboardType="default"
            />

            {/* Total Cambiado */}
            <Text style={styles.label}>Total Cambiado:</Text>
            <TextInput
                value={total_cambiado}
                onChangeText={setTotal_cambiado}
                style={styles.input}
                placeholder="Total Cambiado"
                keyboardType="default"
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
  