import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView , Platform, Button, Modal } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from './jwt';
import  {cadastrarMissao, buscarMissoes, buscarDespesas} from '../services/missao'

const { height } = Dimensions.get('window');

export default function Home() {
    const [missao, setMissao] = useState(''); 
    const [estado, setEstado] = useState('');
    const [pais, setPais] = useState('');
    const { missao_id,  missao_name } = useLocalSearchParams();
    const [cidade, setCidade] = useState('');
    const [visible, setVisible] = useState(false);
    const  user = useJwt();  
    const router = useRouter();
    const [data_inicio_prevista, setData_inicio_prevista] = useState(new Date());
    const [data_final_prevista, setData_final_prevista] = useState(new Date());
    const [showInicio, setShowInicio] = useState(false);
    const [showFinal, setShowFinal] = useState(false);
    const showdata_inicio_prevista = () => setShowInicio(true);
    const showdata_final_prevista = () => setShowFinal(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [missoes, setMissoes] = useState([]);
    const [despesas, setDespesas] = useState([]);
    useEffect(() => {
        const carregarMissoes = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarMissoes(token);            
                setMissoes(data || []); // ✅ Garante que `missoes` será um array
            } catch (error) {
                console.error('Erro ao buscar missões:', error);
            }
        };
    
        const carregarDespesas = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarDespesas(token, missao_id); 
                setDespesas(data || []);
            } catch (error) {
                console.error('Erro ao buscar despesas:', error);
            }
        };
    
        carregarMissoes();
        carregarDespesas();
    }, []);
    



    const onChangedata_inicio_prevista = (event: any, selectedDate?:Date) => {
        const currentDate = selectedDate || data_inicio_prevista;
        setShowInicio(Platform.OS === 'ios' ? true : false);
        setData_inicio_prevista(currentDate);
    };

    const onChangedata_final_prevista = (event: any, selectedDate?:Date) => {
        const currentDate = selectedDate || data_final_prevista;
        setShowFinal(Platform.OS === 'ios' ? true : false);
        setData_final_prevista(currentDate);
    };


    const cadastrar = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (!missao ||!estado ||!cidade) {
            Alert.alert('Erro!', 'Preencha todos os campos obrigatórios.');
            return;
        }
        try{
            if (!user) {
                Alert.alert('Erro', 'Usuário não identificado.');
                return;
            }            
            const response = await cadastrarMissao ({
                user_id: user.id,
                missao,
                estado,
                cidade,
                data_inicio_prevista,
                data_final_prevista,
                pais,
                username: user.name
            }, token)
            Alert.alert('Sucesso!', 'Missão cadastrada com sucesso!');
            setCidade('');
            setPais('');
            setEstado('');
            setMissao('');
        } catch (error) {
            console.error('Erro ao cadastrar missão', error);
            Alert.alert('Erro', 'Erro ao cadastrar missão');
        }
    }

    const back = () => {
        router.back();
    }
    const DESPESAS = (missao_id: number, missao_name: string) => {
        router.push({
            pathname: './csv',
            params: { missao_id, missao_name }
        });
    };

    const Update = (missao_id: number, missao_name: string) => {
        router.push({
            pathname: '/updatemissao', // caminho correto
            params: { missao_id, missao_name }
        });
    };
    
    const slideAnim = useRef(new Animated.Value(height)).current;  // Inicia fora da tela

    const toggleView = () => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: height,  // Move para fora da tela novamente
                duration: 300,
                useNativeDriver: true,
            }).start(() => setVisible(false));
        } else {
            setVisible(true);  
            Animated.timing(slideAnim, {
                toValue: height / 4,  
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <View style={styles.container}>

        {(missoes || []).length > 0 ? (
            missoes.map((missao) => (
                <View key={missao.id} style={styles.cardMission}>
                    <View style={styles.cardInfoFirstLeft}>
                        <Text style={styles.title}>{missao.missao}</Text>
                        <Text>País: {missao.pais}</Text>
                    </View>
                </View>
            ))
        ) : (
            <Text style={styles.emptyText}>Nenhuma missão encontrada</Text>
        )}
            <View style={styles.content}>



                {(missoes || []).length > 0 ? (
                    missoes.map((missao) => (
                        <View key={missao.id} style={styles.cardMission}>
                            <View style={styles.cardInfoFirstLeft}>
                                <Text style={styles.title}>{missao.missao}</Text>
                                <Text>DATA FINAL:  {new Date(missao.data_inicio_prevista).toLocaleDateString()}</Text>
                                <Text>PAIS:  {missao.pais}</Text>
                                <Text>ESTADO/PROVINCIA:  {missao.estado}</Text>
                                <Text>CIDADE:  {missao.cidade}</Text>
                                <Text>DATA FINAL:  {new Date(missao.data_final_prevista).toLocaleDateString()}</Text>
                            </View>

                            <View style={styles.flexButoes}>
                                <TouchableOpacity style={styles.butonsMissaosVisualizar} onPress={() => Update(missao.id, missao.missao)}>
                                    <Text>EDITAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.butonsMissaosVisualizar} onPress={() => DESPESAS(missao.id, missao.missao)}>
                                    <Text>SALVAR DOCUMENTO CSV</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))
                ) : (

                <TouchableOpacity style={styles.butonsMissaosVisualizarModal} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Cadastrar missão</Text>
            </TouchableOpacity>




        )}

        <Text style={styles.titledESPESAS}>DESPESAS
        </Text>
        {despesas.length > 0 ? (
            despesas.map((despesa) => (
                
                <TouchableOpacity key={despesa.id} style={styles.card}>

                    <Text style={styles.title}>
                        {Array.isArray(despesa.descricao) && despesa.descricao.length > 0
                            ? despesa.descricao.join(', ')
                            : despesa.outro}
                    </Text>
                    <Text style={styles.title}>Em {despesa.cidade}</Text>
                    <Text style={styles.title}>R$ {despesa.valor}</Text>
                </TouchableOpacity>
            ))
        ) : (
            <Text style={styles.emptyText}>Nenhuma Despesa encontrada</Text>
        )}


            </View>



            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <View style={styles.CardLogin}>

                    <Text style={styles.TextInput}>Misao</Text>
                    <TextInput
                        value={missao}
                        onChangeText={setMissao}
                        style={styles.input}
                        placeholder='Missao creditado'
                    />

                    <Text style={styles.TextInput}>Selecione a data de início</Text>
                    <Button  onPress={showdata_inicio_prevista} title="Escolher data de início" />
                    <Text  style={styles.textoEscolhido}>{data_inicio_prevista.toLocaleDateString()}</Text>
                    {showInicio && (
                        <DateTimePicker
                            value={data_inicio_prevista}
                            mode="date"
                            display="default"
                            onChange={onChangedata_inicio_prevista}
                            
                        />
                    )}

                    <Text style={styles.TextInput}>Selecione a data final</Text>
                    <Button  onPress={showdata_final_prevista} title="Escolher data final" />
                    <Text style={styles.textoEscolhido}>{data_final_prevista.toLocaleDateString()}</Text>
                    {showFinal && (
                        <DateTimePicker
                            value={data_final_prevista}
                            mode="date"
                            display="default"
                            onChange={onChangedata_final_prevista}
                        />
                    )}
                    <Text style={styles.TextInput}>Pais</Text>
                    <TextInput
                        value={pais}
                        onChangeText={setPais}
                        style={styles.input}
                        placeholder='Pais'
                    />
                    <Text style={styles.TextInput}>Estado / estado</Text>
                    <TextInput
                        value={estado}
                        onChangeText={setEstado}
                        style={styles.input}
                        placeholder='Estado / estado'
                    />
                    <Text style={styles.TextInput}>Cidade</Text>
                    <TextInput
                        value={cidade}
                        onChangeText={setCidade}
                        style={styles.input}
                        placeholder='Cidade'
                    />
                    <TouchableOpacity style={styles.BotaoLogin} onPress={cadastrar}>
                        <Text style={styles.TextBotao}>ADICIONAR</Text>
                    </TouchableOpacity>
                    {/* </View> */}
                    </View>





                    <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setModalVisible(false)}
                    >
                    <Text style={styles.buttonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>

</View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#487d76",
        alignItems: "center",
        // justifyContent: 'flex-end',  // Garante que o conteúdo vai para o fundo da tela
    },
    TextHeaderLogin: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#121212",
        marginBottom: 30,
        height: 120,
        paddingTop: 40,
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        backgroundColor: '#f0f0f0',
        height: 45,
        color: "#000",
        borderRadius: 10,
    },
    TextInput: {
        marginBottom: 3,
        fontSize: 16,
        color: "#121212",
        fontWeight: "bold",
        textAlign: "left",
        marginTop: 10,
    },
    BotaoLogin: {
        width: "100%",
        height: 50,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    footer: {
        position: 'absolute', // Fixa o footer
        bottom: 0,            // Cola no rodapé
        width: '100%',        // Ocupa a largura toda
        height: 70,           // Altura mínima de 70
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,  // Garantir que o footer esteja acima da Animated View
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        padding: 20,
        position: 'absolute',
        bottom: 0,  // Ajusta para começar acima do footer fixo
        width: '100%',
        height: '85%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // borderWidth: 1,
        borderTopColor: '#fafafa',
    },

    CardLogin: {
        padding: 10,
        width: '100%',       
    },

    TextBotao: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
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
    
    cardInfo:{
        margin: 10,
        backgroundColor: 'transparent',
        borderRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        color: '#fff',
        // width: '100%',
    },
    Textshow:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },
    text_saldo:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4ac578'
    },
    cardInfoOut:{
        margin: 10,
        backgroundColor: 'transparent',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        color: '#fff',
        marginTop:50,
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
    cardMission: {
        marginBottom: 10,
        backgroundColor: 'transparent',
        borderRadius: 10,
        // margin:10,
        // borderWidth: 1,
        borderColor: '#fff',
    },
    card:{
        margin: 10,
        backgroundColor: 'transparent',
        padding: 20,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom: 10,
        borderRadius:10
    },




    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    cardInfoFirstLeft:{
        width: '60%',
        // height: 80,
        backgroundColor: 'transparent',
        borderRadius: 20,
        justifyContent: 'center',
        // alignItems: 'left',
        paddingLeft: 20,
    },

    butonsMissaosVisualizar:{
        padding:10,
        backgroundColor: '#fff',
        borderRadius: 10,

        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth:1,
        borderColor: '#ccc',
    },


    butonsMissaosVisualizarModal:{
        padding:10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3,
        borderWidth:1,
        borderColor: '#ccc',
    },


    openButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
      },
      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '90%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      closeButton:{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      flexButoes:{
        flexDirection: 'row',
        justifyContent:'flex-start',
        margin: 15,
        width: '100%',
        columnGap: '10',
      },
      titledESPESAS:{
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        margin: 15,
      },




});
