import React, { useState } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter  } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function Home () 
{
    const router = useRouter();
    const [moeda, setMoeda] = useState('');
    const [valor, setValor] = useState('');
    const [cotacao, setCotacao] = useState('');
    const [moedaOrigem, setMoedaOrigem] = useState('');
    const [moedaDestino, setMoedaDestino] = useState('');
    const [totalAcambiar, setTotalAcambiar] = useState('');
    const [totalValorCambiado, setTotalValorCambiado] = useState('');
    const [numerodoRecibo, setNumerodoRecibo] = useState('');








    const [referencia, setReferencia] = useState('');

    return(
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>Ola, Miqueias faca cambio aqui!</Text>
            <View style={styles.CardLogin}>                

            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInput}>Moeda de Origem</Text>
                <TextInput  value={moedaOrigem} onChangeText={setMoedaOrigem} style={styles.input} placeholder='Moeda de Origem' />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInput}>Moeda de Destino</Text>
                <TextInput  value={moedaDestino} onChangeText={setMoedaDestino} style={styles.input} placeholder='Moeda de Destino' />
                </View>
            </View>

            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInput}>Cotacao</Text>
                <TextInput  value={cotacao} onChangeText={setCotacao} style={styles.input} placeholder='Cotacao' />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInput}>Total a Cambiar</Text>
                <TextInput  value={totalAcambiar} onChangeText={setTotalAcambiar} style={styles.input} placeholder='Total a Cambiar' />
                </View>
            </View>
            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInput}>Total Cambiado</Text>
                <TextInput  value={totalValorCambiado} onChangeText={setTotalValorCambiado} style={styles.input} placeholder='Total Cambiado' />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInput}>N do Recibo</Text>
                <TextInput  value={numerodoRecibo} onChangeText={setNumerodoRecibo} style={styles.input} placeholder='N do Recibo' />
                </View>
            </View>


                <TouchableOpacity style={styles.botaoAdicionaImageRecibo}>
                    <Text style={styles.TextAnexarImagem}>Anexar recibo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.BotaoLogin}>
                    <Text style={styles.TextBotao}>ADICIONAR VALOR CAMBIADO</Text>
                </TouchableOpacity>

                <View style={styles.containerLines}>
                    <View style={styles.line} />
                    <Text style={styles.text}>Or</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>Visualizar cambios cadastradas!  
                    <Text  style={{color:"#00835f", fontSize:17}}><Link href="/"> Ver agora</Link></Text>
                    </Text>
                </View>
            </View>
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
        padding: 30,
        borderWidth: 1,
        borderColor: "#ccc",
        // width: "100%",
        // color:"#121212",
        backgroundColor: '#f0f0f0',
        height:40,
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
    } 
})