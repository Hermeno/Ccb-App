import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert, Platform, Button, Modal, FlatList  } from 'react-native';
import { Link, useRouter, useLocalSearchParams   } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { cadastrarCambio } from '../services/cambio';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useJwt } from './jwt'

export default function Home () 
{
    const router = useRouter();
    const user = useJwt();
    const { id, username } = useLocalSearchParams();
    const [cotacao, setCotacao] = useState('');
    const [moeda_origem, setMoeda_origem] = useState('');
    const [cidade, setCidade] = useState('');
    const [data_inicio_prevista, setData_inicio_prevista] = useState(new Date());
    const [showInicio, setShowInicio] = useState(false);
    const showdata_inicio_prevista = () => setShowInicio(true);
    const [moeda_destino, setMoeda_destino] = useState('');
    const [total_a_cambiar, setTotal_a_cambiar] = useState('');
    const [total_cambiado, setTotal_cambiado] = useState('');
    const [numero_recibo, setNumero_recibo] = useState('');
    const [foto_recibo, setFoto_recibo] = useState('');
    const [moeda, setMoeda] = useState('');
    const [descricao, setDescricao] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const opcoes = [
        { id: '1', label: 'Taxi' },
        { id: '2', label: 'Almoço' },
        { id: '3', label: 'Hospedagem' },
        { id: '4', label: 'Atendimento da Piedade' },
    ];
    const handleSelectItem = (item: string) => {
        if (descricao.includes(item)) {
            setDescricao(descricao.filter((desc) => desc !== item));
        } else {
            setDescricao([...descricao, item]);
        }
    };





    const handleCambio = async () =>{
        if (!user) {
            Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
            return;
        }
        if (!moeda_origem ||!moeda_destino ||!cotacao ||!total_a_cambiar ||!numero_recibo ||!foto_recibo) {
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
                numero_recibo,
                foto_recibo,
                user_id: user.id,
                username: user.username,
            })
            if(response.status === 200) {
                Alert.alert('Cambio realizado com sucesso!');
            }
        }catch(error) {
            console.log(error, 'erro ao cadastrar cambio');
        }
    }

    const onChangedata_inicio_prevista = (event: any, selectedDate?:Date) => {
        const currentDate = selectedDate || data_inicio_prevista;
        setShowInicio(Platform.OS === 'ios' ? true : false);
        setData_inicio_prevista(currentDate);
    };





    return(
        <View style={styles.container}>
            {/* {user ? (
                <Text style={styles.TextHeaderLogin}>Ola, {user.name} faca cadastro de despesas!</Text>
            ) : (
                <Text style={styles.TextHeaderLogin}>Esta carregando...</Text>
            )} */}
            
            <View style={styles.CardLogin}> 
            <Text style={styles.TextInput}>Moeda a debitar:</Text>
            <Picker selectedValue={moeda} onValueChange={(itemValue) => setMoeda(itemValue)} style={styles.picker} >
                <Picker.Item label="Selecione uma moeda..." value="" />
                <Picker.Item label="Dólar" value="dolar" />
                <Picker.Item label="Real" value="real" />
                <Picker.Item label="Metical" value="metical" />
                <Picker.Item label="Euro" value="euro" />
                <Picker.Item label="Libra" value="libra" />
                <Picker.Item label="Iene" value="iene" />
            </Picker>
            <Text style={styles.result}>Moeda selecionada: {moeda}</Text>



               
            <View style={styles.ViewFlex}>
                <View style={styles.ViewInputOne}>
                <Text style={styles.TextInput}>Selecione a data Padrao</Text>
                    <Button  onPress={showdata_inicio_prevista} title="Escolher data padrao" />
                        <Text  style={styles.textoEscolhido}>{data_inicio_prevista.toLocaleDateString()}</Text>
                        {showInicio && (
                            <DateTimePicker value={data_inicio_prevista} mode="date" display="default" onChange={onChangedata_inicio_prevista} />
                        )}
                </View>
            </View>


            <View  style={styles.ViewFlex}>
                <View style={styles.ViewInputOne}>
                <Text style={styles.TextInputs}>Cidade</Text>
                <TextInput  value={cidade} onChangeText={setCidade} style={styles.inputOne} placeholder='Valor creditado' />
                </View>
            </View>


            <View style={styles.ViewFlex}>
                <View style={styles.ViewInputOne}>
                    <Text style={styles.TextInputs}>Descrição</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
                        <Text>
                            {descricao.length > 0 ? descricao.join(', ') : 'Selecione uma ou mais opções'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={opcoes}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        descricao.includes(item.label) && styles.optionSelected
                                    ]}
                                    onPress={() => handleSelectItem(item.label)}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                            <TouchableOpacity style={styles.Outro} onPress={() => setModalVisible(false)}>
                                <Text >Outro</Text>
                            </TouchableOpacity>
                        <View>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>                
            </View>


            <View  style={styles.ViewFlex}>
                <View style={styles.ViewInputOne}>
                <Text style={styles.TextInputs}>Cidade</Text>
                <TextInput  value={cidade} onChangeText={setCidade} style={styles.inputOne} placeholder='Valor creditado' />
                </View>
            </View>




            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>Valor</Text>
                <TextInput  value={total_cambiado} onChangeText={setTotal_cambiado} style={styles.input} placeholder='Valor' />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>N do Recibo</Text>
                <TextInput  value={numero_recibo} onChangeText={setNumero_recibo} style={styles.input} placeholder='N do Recibo' />
                </View>
            </View>


                <TouchableOpacity style={styles.botaoAdicionaImageRecibo}>
                    <Text style={styles.TextAnexarImagem}>Anexar recibo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.BotaoLogin} onPress={handleCambio}>
                    <Text style={styles.TextBotao}>CADASTRAR DESPESA</Text>
                </TouchableOpacity>

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
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        // width: "100%",
        color:"#121212",
        backgroundColor: '#f0f0f0',
        height:45,
        borderRadius:0,
    },
    TextInputs:{
        marginBottom: 3,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            textAlign: "left",
            marginTop: 0,
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
        marginBottom: 1,
    },    
    ViewInputOne:{
        width: '100%',
        marginBottom: 1,
    },
    ViewInputOneOption:{
        width: '80%',
        marginBottom: 1,
    }, 
    ViewInputOneOutro:{
        width: '17%',
        marginBottom: 1,
    },
 
    botaoAdicionaImageRecibo:{
        width: '100%',
        height: 40,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
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
    textoEscolhido:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4ac578',
        marginTop: 10,
        // borderWidth: 5,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    inputOne:{
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        color:"#121212",
        backgroundColor: '#f0f0f0',
        height:50,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
    },
    optionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionSelected: {
        backgroundColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 40,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    }, 
    Outro: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
        borderWidth:1,
        borderColor: '#ccc',
    }   
})