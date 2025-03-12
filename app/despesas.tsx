import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert, Platform, Button, Modal, FlatList  } from 'react-native';
import { Link, useRouter, useLocalSearchParams   } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { cadastrarDespesa } from '../services/despesas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useJwt } from './jwt'

export default function Home () 
{
    const router = useRouter();
    const user = useJwt();
    const { missao_id, missao_name } = useLocalSearchParams();
    const [valor, setValor] = useState('');
    const [cidade, setCidade] = useState('');
    const [outro, setOutro] = useState('');
    const [showOutro, setShowOutro] = useState(false);
    const [data_padrao, setData_padrao] = useState(new Date());
    const [showInicio, setShowInicio] = useState(false);
    const showdata_padrao = () => setShowInicio(true);
    const [numero_recibo, setNumero_recibo] = useState('');
    const [foto_recibo, setFoto_recibo] = useState('');
    const [moeda, setMoeda] = useState('');
    const [descricao, setDescricao] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const opcoes = [
        { id: '1', label: 'Taxi' },
        { id: '2', label: 'Almoço' },
        { id: '3', label: 'Hospedagem' },
        { id: '4', label: 'Atendimento' },
        { id: '5', label: 'Bilhete Aerea' },
        { id: '6', label: 'Cafe de Manha' },
        { id: '7', label: 'Janta' },
        { id: '8', label: 'Lanche' },
        { id: '9', label: 'Medicamentos' },
        { id: '10', label: 'Taxi / Uber' },
    ];
    const handleSelectItem = (item: string) => {
        if (descricao.includes(item)) {
            setDescricao(descricao.filter((desc) => desc !== item));
        } else {
            setDescricao([...descricao, item]);
        }
    };





    const handleDespesa = async () => {
        const token = await AsyncStorage.getItem('userToken');
    
        if (!user) {
            Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
            return;
        }
    
        if (!valor || !cidade || !data_padrao || !numero_recibo) {
            Alert.alert('Erro', 'Todos os campos precisam ser preenchidos.');
            return;
        }
    
        if ((Array.isArray(descricao) && descricao.length === 0) && !outro) {
            Alert.alert('Erro', 'Pelo menos uma categoria ou outro campo precisa ser preenchido.');
            return;
        }
    
        try {
            const response = await cadastrarDespesa({
                user_id: user.id,
                moeda,
                valor,
                cidade,
                descricao: JSON.stringify(descricao), // ✅ Convertendo array para string JSON
                outro,
                data_padrao: data_padrao instanceof Date ? data_padrao.toISOString() : data_padrao, // ✅ Formatando para ISO
                numero_recibo,
                missao_id: missao_id ?? null, // ✅ Tratando caso missao_id esteja indefinido
                missao_name: missao_name ?? null, // ✅ Tratando caso missao_name esteja indefinido
            }, token);
    
            Alert.alert('Sucesso!', 'Despesa cadastrada com sucesso!');
    
            // ✅ Resetando os campos
            setValor('');
            setCidade('');
            setDescricao([]);
            setData_padrao(new Date());
            setNumero_recibo('');
            setOutro('');
            setModalVisible(false);
    
        } catch (error) {
            console.log(error, 'Erro ao cadastrar despesa');
            Alert.alert('Erro', 'Não foi possível cadastrar a despesa. Tente novamente.');
        }
    };
    

    const onChangedata_padrao = (event: any, selectedDate?:Date) => {
        const currentDate = selectedDate || data_padrao;
        setShowInicio(Platform.OS === 'ios' ? true : false);
        setData_padrao(currentDate);
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
                    <Button  onPress={showdata_padrao} title="Escolher data padrao" />
                        <Text  style={styles.textoEscolhido}>{data_padrao.toLocaleDateString()}</Text>
                        {showInicio && (
                            <DateTimePicker value={data_padrao} mode="date" display="default" onChange={onChangedata_padrao} />
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
                            <View>
                                {showOutro && (
                                    <View style={styles.ViewInputOne}>
                                        <Text style={styles.TextInputs}>Outro</Text>
                                        <TextInput  value={outro} onChangeText={setOutro} style={styles.inputOne} placeholder="Valor creditado" />
                                    </View>
                                )}
                                <TouchableOpacity style={styles.Outro} onPress={() => setShowOutro(!showOutro)}>
                                    <Text>{showOutro ? 'Fechar Outro' : 'Outro'}</Text>
                                </TouchableOpacity>
                            </View>
                        <View>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>                
            </View>



            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>Valor</Text>
                <TextInput  value={valor} onChangeText={setValor} style={styles.input} placeholder='Valor' />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>N do Recibo</Text>
                <TextInput  value={numero_recibo} onChangeText={setNumero_recibo} style={styles.input} placeholder='N do Recibo' />
                </View>
            </View>


                <TouchableOpacity style={styles.botaoAdicionaImageRecibo}>
                    <Text style={styles.TextAnexarImagem}>Anexar recibo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.BotaoLogin} onPress={handleDespesa}>
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

    TextBotao:{
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "bold",
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