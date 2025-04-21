import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView , Platform, Button, Modal } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from './jwt';
import  {cadastrarMissao, buscarMissoes,buscarMissoesAll, buscarDespesas, terminarMissao} from '../services/missao'

const { height } = Dimensions.get('window');

export default function Home() {
    const [missao, setMissao] = useState(''); 
    const [estado, setEstado] = useState('');
    const [pais, setPais] = useState('');
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



    const [missaoId, setMissaoId] = useState<string | null>(null);
    const [missaoName, setMissaoName] = useState('');  
    useEffect(() => {
       const fetchMissao = async () => {
         const missao_id = await AsyncStorage.getItem('missao_id');
         const missao_name = await AsyncStorage.getItem('missao_name');         
         if (missao_id) {
           setMissaoId(missao_id);
         }
         if (missao_name) {
           setMissaoName(missao_name);
         }
       };   
       fetchMissao();
     }, []);  




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
                const data = await buscarDespesas(token, missaoId); 
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
                Alert.alert('Usuário não identificado.');
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
            router.replace(`/home`);
            setCidade('');
            setPais('');
            setEstado('');
            setMissao('');
        } catch (error) {
            console.error('Erro ao cadastrar missão', error);
            Alert.alert('Erro ao cadastrar missão');
        }
    }

    const back = () => {
        router.back();
    }
    const DESPESAS = (missaoId: string, missaoName: string) => {
        router.push({
            pathname: './csv',
            params: { missaoId, missaoName }
        });
    };

    const Update = (missaoId: string, missaoName: string) => {
        router.push({
            pathname: '/updatemissao', // caminho correto
            params: { missaoId, missaoName }
        });
    };


    const DOWNLOD = (id_despesa: string) => {
        router.push(`/image?id_post=${id_despesa}`)
    }
      
    const goTo = (id_despesa: string) => {
        router.push({
            pathname: '/updatedespesa',
            params: { id_despesa, missaoId, missaoName }
        });
    }
    
    const handleAcceptOrCancel = (missaoId: string) => {
        Alert.alert(
            'Confirmação',
            'Você deseja mesmo terminar a missão?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {
                        Alert.alert('Missão Cancelada', 'Nenhuma ação foi realizada.');
                    },
                    style: 'cancel',
                },
                {
                    text: 'Aceitar',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('userToken');
                            if (!missaoId) {
                                Alert.alert('Erro', 'ID da missão não encontrado.');
                                return;
                            }
                            await terminarMissao(token, missaoId, 'terminado');
                            Alert.alert('Missão terminada.');
                        } catch (error) {
                            console.error('Erro ao aceitar missão:', error);
                            Alert.alert('Falha ao terminar a missão.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
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
        // <ScrollView>
        <View style={styles.container}>
                <View  style={styles.cardMission}>
                    <View style={styles.cardInfoFirstLeft}>
                        <Text style={styles.titleMissioa}>{missaoName}</Text>
                        <View style={styles.flexButoes}>
                                <TouchableOpacity style={styles.butonsMissaosVisualizar} onPress={() => DESPESAS(missaoId, missaoName)}>
                                    <Text style={styles.titleBTN}>SALVAR DOCUMENTO CSV</Text>
                                </TouchableOpacity>
                         </View>
                    </View>
                </View>
            <View style={styles.content}>

        <ScrollView>
        <Text style={styles.titledESPESAS}>DESPESAS
        </Text>
        {despesas.length > 0 ? (
            despesas.map((despesa) => (
                
                <View key={despesa.id} style={styles.card}>
                    <Text style={styles.titleSDaDespesa}>{despesa.descricao}</Text>

                        <View style={styles.flexSonData}>
                        <TouchableOpacity style={styles.buttonUdate} onPress={ () => goTo(despesa.id)}>
                        <Text style={styles.buttonText}><MaterialIcons name="edit" size={20} color="black" /></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonUdate} onPress={ () => DOWNLOD(despesa.id)}>
                            <Text style={styles.buttonText}>Imagens</Text>
                        </TouchableOpacity>
                        </View>
                </View>
            ))
        ) : (
            <Text style={styles.emptyText}>Nenhuma Despesa encontrada</Text>
        )}
        </ScrollView>

            </View>
            



            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <View style={styles.CardLogin}>

                    <Text style={styles.TextInput}>Misao</Text>
                    <TextInput value={missao} onChangeText={setMissao} style={styles.input} placeholder='Nome da Missao'
                    />
                    <View style={styles.inputsButtons}>
                        <View>
                        <Text style={styles.TextInput}>Data de início</Text>
                            <Button   onPress={showdata_inicio_prevista} title="Escolher data inicio" />
                            <Text  style={styles.textoEscolhido}>{data_inicio_prevista.toLocaleDateString()}</Text>
                            {showInicio && (
                                <DateTimePicker
                                    value={data_inicio_prevista}
                                    mode="date"
                                    display="default"
                                    onChange={onChangedata_inicio_prevista}
                                    
                                />
                            )}                            
                        </View>
                        <View>
                            <Text style={styles.TextInput}>Data final</Text>
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
                        </View>
                    </View>
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
// </ScrollView>
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
        marginTop: 3,
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
        // alignItems: 'center',
    },
    card:{
        margin: 10,
        backgroundColor: 'transparent',
        padding: 10,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-around',
        marginBottom: 10,
        borderRadius:20
    },




    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    titleSDaDespesa:{
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        // marginLeft: 10,

    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    emptyTextTop: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        marginTop: 20,
    },
    cardInfoFirstLeft:{
        // width: '60%',
        // backgroundColor: 'red',
        borderRadius: 20,
        // justifyContent: 'center',
        alignItems:'center',
        alignContent:'center'
    },
    cardInfoFirstLeftDown:{
        width: '60%',
        backgroundColor: 'transparent',
        borderRadius: 20,
        justifyContent: 'center',
        // alignItems: 'left',
        paddingLeft: 20,
    },

    butonsMissaosVisualizar:{
        padding:10,
        backgroundColor: 'transparent',
        borderRadius: 10,

        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth:1,
        borderColor: '#fff',
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
        justifyContent:'center',
        marginTop: 15,
        width: '100%',
        // columnGap: '10',
      },
      titledESPESAS:{
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        margin: 15,
      },
      buttonUdate:{
        // width: '25%',
        // backgroundColor: '#4CAF50',
        // padding: 10,
        paddingVertical:10,
        paddingHorizontal:20,
        borderRadius: 288,
        // marginBottom: 10,
        // marginLeft: 10,
        justifyContent: 'center',
        // alignItems: 'center',
        borderWidth:1,
        borderColor: '#ccc',
      },
      titleMissioa:{
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        color: '#FFFFFF',
        alignItems: 'center',
      },
      titleMisiContr:{
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        // marginLeft: 15,
        marginTop: 5,
        color: '#FFFFFF',
      },
      buttonTerminarMissao:{
        width: '100%',
        // backgroundColor: '#4CAF50',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderColor: '#ccc',
      },
      flexSonData:{
        flexDirection: 'row',
        justifyContent:'flex-end',
        // margin: 15,
        // width: '100%',
        columnGap: '10',
      },
      inputsButtons:{
        flexDirection: 'row',
        justifyContent:'center',
        // margin: 15,
        // width: '100%',
        columnGap: '10',
      },
      btnTime:{
        padding: 10,
        borderRadius: 10,
        // marginBottom: 10,
        // marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderColor: '#ccc',
      },
      titleBTN:{
        fontSize: 16,
        // fontWeight: 'bold',
        // marginBottom: 10,
        // marginLeft: 15,
        color: '#FFFFFF',
      }
});
