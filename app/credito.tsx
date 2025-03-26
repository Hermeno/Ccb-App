import React, { useState } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter, useLocalSearchParams  } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cadastrarCredito } from '../services/credito';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useJwt } from './jwt';

export default function Home () 
{
    const router = useRouter();
    const  user = useJwt(); 
    const { missao_id } = useLocalSearchParams();
    const [moeda, setMoeda] = useState('');
    const [valor, setValor] = useState('');
    const [referencia, setReferencia] = useState('');

    const back = () => {
        router.back();
    }
  
    const cadastrar = async () => {
        const token = await AsyncStorage.getItem('userToken'); 
        if (!moeda || !valor || !referencia) {
            Alert.alert('Erro!', 'Preencha todos os campos obrigatórios.');
            return;
        } 
        if (!user) {
            Alert.alert('Erro', 'Usuário não identificado.');
            return;
        }
        try {            
            if (!token) {
                Alert.alert('Erro', 'Token não encontrado. Faça login novamente.'+ token);
                return;
            }
            const response = await cadastrarCredito({
                user_id: user.id,
                moeda,
                valor,
                referencia,
                missao_id
            }, token);
            Alert.alert('Sucesso!', 'Cadastrada com sucesso!');
            setMoeda('');
            setValor('');
            setReferencia('');
        } catch (error) {
            Alert.alert('Erro!', 'Ocorreu um erro ao cadastrar seu crédito. Tente novamente.');
        }
    };
    
    

    return(
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>Ola, {user?.name} Adicione seu saldo aqui!</Text>
            <View style={styles.CardLogin}>                

            <Text style={styles.TextInputUp} >Selecione a moeda:</Text>
            <Picker
                selectedValue={moeda}
                onValueChange={(itemValue) => setMoeda(itemValue)}
                style={styles.picker}
            > 
                <Picker.Item label="Selecione uma moeda..." value="" />
                <Picker.Item label="Dólar" value="dolar" />
                <Picker.Item label="Real" value="real" />
                <Picker.Item label="Metical" value="metical" />
                <Picker.Item label="Euro" value="euro" />
                <Picker.Item label="Libra" value="libra" />
                <Picker.Item label="Iene" value="iene" />
            </Picker>
            <Text style={styles.result}>Moeda selecionada: {moeda}</Text>

            <Text style={styles.TextInput}>Valor creditado</Text>
            <TextInput  value={valor} onChangeText={setValor} style={styles.input} placeholder='Valor creditado' keyboardType="numeric" />


            <Text style={styles.TextInput}>Referencia:</Text>
            <Picker
                selectedValue={referencia}
                onValueChange={(itemValue) => setReferencia(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Selecione uma referencia..." value="" />
                <Picker.Item label="Para alimentacao" value="Para alimentacao" />
                <Picker.Item label="Pra Gazolina" value="Pra Gazolina" />
                <Picker.Item label="Pra hospedaria" value="Pra hospedaria" />
                <Picker.Item label="Pra viajem" value="Pra viajem" />
            </Picker>
            <Text style={styles.result}>Referencia selecionada: {referencia}</Text>





                <TouchableOpacity style={styles.BotaoLogin} onPress={cadastrar}>
                    <Text style={styles.TextBotao}>ADICIONAR</Text>
                </TouchableOpacity>

                {/* <View style={styles.containerLines}>
                    <View style={styles.line} />
                    <Text style={styles.text}>Or</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>Logar na sua conta!  
                    <Text  style={{color:"#00835f", fontSize:17}}><Link href="/"> Sign-In</Link></Text>
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
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    TextHeaderLogin:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#00835f",
        marginBottom: 40,
        height: 100,
        paddingTop: 40,
    },
    CardLogin:{
        width: '100%',
        // height: 400,
        flex:1,
        backgroundColor: "#fff",
        // borderRadius: 30,
        padding: 20,
        marginTop: 0, 
        justifyContent: "center",
        alignItems: "center",
        // borderTopEndRadius: 40,
        // borderTopStartRadius: 40,
    },
    input:{
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        color:"#121212",
        backgroundColor: '#f0f0f0',
        height:50,
    },
    TextInput:{
        marginBottom: 10,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            textAlign: "left",
            marginTop: 10,
    },
    TextInputUp:{
        marginBottom: 10,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            textAlign: "left",
            marginTop: -70,
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