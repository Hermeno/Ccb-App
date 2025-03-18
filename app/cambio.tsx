import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import { cadastrarCambio } from '../services/cambio';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useJwt } from './jwt'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home () 
{
    const router = useRouter();
    const user = useJwt();
    const [cotacao, setCotacao] = useState('');
    const [moeda_origem, setMoeda_origem] = useState('');
    const [moeda_destino, setMoeda_destino] = useState('');
    const [total_a_cambiar, setTotal_a_cambiar] = useState('');
    const [total_cambiado, setTotal_cambiado] = useState('');
    const [numero_recibo, setNumero_recibo] = useState('');
    const [foto_recibo, setFoto_recibo] = useState('');

    const OPENCAMERA = () => {
        router.push('/camera');
    }

    const handleCambio = async () =>{
        const token = await AsyncStorage.getItem('userToken'); 
        if (!user) {
            Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
            return;
        }
        if (!moeda_origem ||!moeda_destino ||!cotacao ||!total_a_cambiar ||!numero_recibo) {
            Alert.alert('Erro', 'Todos os campos precisam ser preenchidos.');
            return;
        }
        try{
            const response = await cadastrarCambio ({
                moeda_origem,
                moeda_destino,
                cotacao,
                total_a_cambiar,
                total_cambiado,
                numero_recibo
            }, token)
            if(response.status === 200) {
                Alert.alert('Cambio realizado com sucesso!');
            }
            setCotacao('');
            setMoeda_destino('');
            setMoeda_origem('');
            setTotal_a_cambiar('');
            setTotal_cambiado('');
            setNumero_recibo('');
        }catch(error) {
            console.log(error, 'erro ao cadastrar cambio',user.id);
        }
    }



    return(
        <View style={styles.container}>
            {user ? (
                <Text style={styles.TextHeaderLogin}>Ola, {user.name} faca cambio aqui!</Text>
            ) : (
                <Text style={styles.TextHeaderLogin}>Esta carregando...</Text>
            )}
            
            <View style={styles.CardLogin}>                
            <View style={styles.ViewFlex}>
            <View style={styles.ViewInput}>
            <Text style={styles.TextInputs} >Moeda de Origem:</Text>
            <Picker
                selectedValue={moeda_origem}
                onValueChange={(itemValue) => setMoeda_origem(itemValue)}
                style={styles.picker}
            > 
                <Picker.Item label="Selecione uma moeda_origem..." value="" />
                <Picker.Item label="Dólar" value="dolar" />
                <Picker.Item label="Real" value="real" />
                <Picker.Item label="Metical" value="metical" />
                <Picker.Item label="Euro" value="euro" />
                <Picker.Item label="Libra" value="libra" />
                <Picker.Item label="Iene" value="iene" />
            </Picker>
            <Text style={styles.result}>Moeda selecionada: {moeda_origem}</Text>
            </View>
            <View style={styles.ViewInput}>       
            <Text style={styles.TextInputs} >Moeda de Destino:</Text>
            <Picker
                selectedValue={moeda_destino}
                onValueChange={(itemValue) => setMoeda_destino(itemValue)}
                style={styles.picker}
            > 
                <Picker.Item label="Selecione uma moeda_destino..." value="" />
                <Picker.Item label="Dólar" value="dolar" />
                <Picker.Item label="Real" value="real" />
                <Picker.Item label="Metical" value="metical" />
                <Picker.Item label="Euro" value="euro" />
                <Picker.Item label="Libra" value="libra" />
                <Picker.Item label="Iene" value="iene" />
            </Picker>
            <Text style={styles.result}>Moeda selecionada: {moeda_destino}</Text>
            </View>
            </View>

            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>Cotacao</Text>
                <TextInput  value={cotacao} onChangeText={setCotacao} style={styles.input} placeholder='Cotacao' />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>Total a Cambiar</Text>
                <TextInput  value={total_a_cambiar} onChangeText={setTotal_a_cambiar} style={styles.input} placeholder='Total a Cambiar' />
                </View>
            </View>
            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>Total Cambiado</Text>
                <TextInput  value={total_cambiado} onChangeText={setTotal_cambiado} style={styles.input} placeholder='Total Cambiado' />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>N do Recibo</Text>
                <TextInput  value={numero_recibo} onChangeText={setNumero_recibo} style={styles.input} placeholder='N do Recibo' />
                </View>
            </View>


                <TouchableOpacity style={styles.botaoAdicionaImageRecibo} onPress={OPENCAMERA}>
                    <Text style={styles.TextAnexarImagem}>Anexar recibo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.BotaoLogin} onPress={handleCambio}>
                    <Text style={styles.TextBotao}>ADICIONAR VALOR CAMBIADO</Text>
                </TouchableOpacity>

                {/* <View style={styles.containerLines}>
                    <View style={styles.line} />
                    <Text style={styles.text}>Or</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>Visualizar cambios cadastradas!  
                    <Text  style={{color:"#00835f", fontSize:17}}><Link href="/"> Ver agora</Link></Text>
                    </Text>
                </View> */}
            </View>
            {/* <View style={styles.footer}>
            
            <TouchableOpacity onPress={back} style={{marginLeft:10}}>
            <MaterialIcons name="arrow-back-ios" size={20} color="blue" />
            </TouchableOpacity>


            <TouchableOpacity style={styles.profile}>
            <FontAwesome name="user-o" size={20} color="blue" />
            </TouchableOpacity>
        </View> */}
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
    },
    TextHeaderLogin:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#487d76",
        marginBottom: 30,
        height: 50,
        paddingTop: 30,
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
        // borderTopEndRadius: 40,
        // borderTopStartRadius: 40,
    },
    input:{
        marginBottom: 10,
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        // width: "100%",
        color:"#121212",
        backgroundColor: '#f0f0f0',
        height:45,
    },
    TextInputs:{
        marginBottom: 10,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            textAlign: "left",
            marginTop: 10,
    },

    TextAnexarImagem:{
        marginBottom: 10,
        borderColor: "#121212",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            marginTop: 10,
    },

    BotaoLogin:{
        width: "100%",
        height: 50,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
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
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#f0f0f0',
    },
    result: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00835f',
    },  
    ViewFlex:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 20,
        width: '100%',
        columnGap: '10',
    },
    ViewInput:{
        width: '48%',
        marginBottom: 10,
    },
    botaoAdicionaImageRecibo:{
        width: '100%',
        height: 40,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 3,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    footer: {
        position: 'absolute', // Fixa o footer
        bottom: 0,            // Cola no rodapé
        width: '100%',        // Ocupa a largura toda
        height: 70,           // Altura mínima de 70
        backgroundColor: '#fafafa',
        // borderTopWidth: 1,
        // borderTopColor: '#ccc',
        alignItems: 'center',
        zIndex: 1,  // Garantir que o footer esteja acima da Animated View
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        padding:10,
    },
    profile:{
        width: 100,
        height: 50,
        backgroundColor: '#a2564a',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        padding: 10,
        marginBottom: 5,
    },
})