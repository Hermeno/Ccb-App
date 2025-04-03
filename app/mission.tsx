import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView, Button, TextInput, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { buscarMissoesAll, cadastrarMissao } from '../services/missao';
import { useJwt } from './jwt';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Mission() {
    const router = useRouter();
    const user = useJwt();
    const [missoes, setMissoes] = useState([]);
    const [missaoId, setMissaoId] = useState<string | null>(null);
    const [missaoName, setMissaoName] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const params = useLocalSearchParams();






    const showdata_inicio_prevista = () => setShowInicio(true);
    const showdata_final_prevista = () => setShowFinal(true);
    const [missao, setMissao] = useState(''); 
    const [estado, setEstado] = useState('');
    const [pais, setPais] = useState('');
    const [cidade, setCidade] = useState('');
    const [visible, setVisible] = useState(false);
    const [data_inicio_prevista, setData_inicio_prevista] = useState(new Date());
    const [data_final_prevista, setData_final_prevista] = useState(new Date());
    const [showInicio, setShowInicio] = useState(false);
    const [showFinal, setShowFinal] = useState(false);



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



    const carregarMissoes = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const data = await buscarMissoesAll(token);
            if (data && data.length > 0) {
                setMissoes(data);
                setMissaoId(data[0].id);
                setMissaoName(data[0].missao);
            } else {
                setMissoes([]);
                setMissaoId(null);
            }
        } catch (error) {
            console.error('Erro ao buscar missões:', error);
        }
    };

    useEffect(() => {
        carregarMissoes();
    }, []);

    // useEffect(() => {
    //     carregarMissoes(); // Carregar inicialmente
    
    //     const interval = setInterval(() => {
    //         carregarMissoes();
    //     }, 1000); // Atualiza a cada 5 segundos
    
    //     return () => clearInterval(interval); // Limpa o intervalo ao desmontar
    // }, []);
    











    const cadastrar = async () => {
        const token = await AsyncStorage.getItem('userToken');
    
        if (!missao || !estado || !cidade) {
            Alert.alert('Erro!', 'Preencha todos os campos obrigatórios.');
            return;
        }
    
        try {
            if (!user) {
                Alert.alert('Usuário não identificado.');
                return;
            }
    
            await cadastrarMissao({
                user_id: user.id,
                missao,
                estado,
                cidade,
                data_inicio_prevista,
                data_final_prevista,
                pais,
                username: user.name
            }, token);
    
            Alert.alert('Sucesso!', 'Missão cadastrada com sucesso!');
    
            // Limpar os campos do formulário
            setCidade('');
            setPais('');
            setEstado('');
            setMissao('');
    
            // Atualizar a lista de missões
            await carregarMissoes();  // <--- Adiciona essa linha para atualizar a lista
            setModalVisible(false);   // Fechar o modal após cadastrar
        } catch (error) {
            console.error('Erro ao cadastrar missão', error);
            Alert.alert('Erro ao cadastrar missão');
        }
    };
      

        const move = (missao_id: string, missao_name: string) => {
            if (missao_id) {
                router.push(`/home?missao_id=${missao_id}&missao_name=${missao_name}`);
            }
        };
        

    return (
        <View style={styles.container}>
            {/* {user ? (
                <Text style={styles.TextHeaderLogin}>Olá, {user.name}!</Text>
            ) : (
                <Text style={styles.TextHeaderLogin}>Carregando...</Text>
            )} */}
            
            <View style={{ width: '100%' , marginBottom:100 }}>
                {missoes.length > 0 ? (
                    <FlatList
                        data={missoes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.cardItem}>
                                <Text style={styles.cardItemTitle}>{item.missao}</Text>
                                <Text style={styles.cardItemText}><Text style={styles.cardItemLabel}>Estado:</Text> {item.estado}</Text>
                                <Text style={styles.cardItemText}><Text style={styles.cardItemLabel}>Cidade:</Text> {item.cidade}</Text>
                                <Text style={styles.cardItemText}><Text style={styles.cardItemLabel}>País:</Text> {item.pais}</Text>
                                <Text style={styles.cardItemText}><Text style={styles.cardItemLabel}>Início:</Text> {item.data_inicio_prevista}</Text>
                                <Text style={styles.cardItemText}><Text style={styles.cardItemLabel}>Final:</Text> {item.data_final_prevista}</Text>
                                <TouchableOpacity style={styles.registerButtonUI} onPress={() => move(item.id, item.missao) }>
                                    <Text style={styles.registerButtonText}>Entrar </Text>
                                    <FontAwesome name="arrow-right" size={20} color="#00835f" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                ) : (
                    <TouchableOpacity style={styles.registerButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.registerButtonText}>CADASTRAR MISSÃO</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {/* Modal para Cadastro */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cadastrar Missão</Text>
                    <Text style={styles.TextInput}>Missao</Text>
                    <TextInput value={missao} onChangeText={setMissao} style={styles.input} placeholder='Nome da Missao'
                    />
                    <View style={styles.inputsButtons}>
                        <View>
                        <Text style={styles.TextInput}>Data de início</Text>
                            <Button   onPress={showdata_inicio_prevista} title="Escolher data inicio" />
                            <Text  style={styles.textoEscolhido}>{data_inicio_prevista.toLocaleDateString()}</Text>
                            {showInicio && (
                                <DateTimePicker value={data_inicio_prevista} mode="date" display="default" onChange={onChangedata_inicio_prevista}/>
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
                        <View style={styles.btnModalFLEX}>
                        <TouchableOpacity style={styles.BotaoLogin} onPress={cadastrar}>
                        <Text style={styles.modalCloseText}>SALVAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity  style={styles.modalCloseButton}  onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseText}>Fechar</Text>
                        </TouchableOpacity>                        
                        </View>
                    </View>
                </View>
            </Modal>
            
            {/* Footer fixo com botão */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.registerButton} onPress={() => setModalVisible(true)} >
                <FontAwesome name="plus" size={20} color="#000" style={styles.icon} />
                    <Text style={styles.registerButtonText}>CADASTRAR MISSÃO</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        // padding: 20,
    },
    TextHeaderLogin: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#487d76",
        marginBottom: 20,
        textAlign: 'center',
    },
    cardItem: {
        backgroundColor: "#ffffff",
        borderRadius: 25,
        padding: 15,
        margin: 10,
        borderWidth: 2,
        borderColor: "#ccc",
    },
    cardItemTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        margin: 5,
    },
    cardItemText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    cardItemLabel: {
        fontWeight: "bold",
        color: "#487d76",
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'transparent',
        // padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        height:100,
    },
    registerButton: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        width: '100%',
        height: '100%',


        display: 'flex',
        justifyContent: "space-around",
        flexDirection: "row",

    },
    registerButtonUI: {
        backgroundColor: "transparent",
        // padding: 5,
        // borderRadius: 15,
        alignItems: "center",
        borderTopWidth:2,
        borderColor: '#ccc',
        width: '100%',



        display: 'flex',
        justifyContent: "space-around",
        flexDirection: "row",
    },
    registerButtonText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: '80%',
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    modalCloseButton: {
        // marginTop: 15,
        backgroundColor: "#ff4444",
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        width: '20%',
        height: 40,


    },
    modalCloseText: {
        color: "#fff",
        fontWeight: "bold",
    },
    TextInput:{
        marginBottom: 10,
        fontSize: 16,
        textAlign: "left"
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
    BotaoLogin:{
        backgroundColor: '#4ac578',
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        width: '70%',
        height: 40,
    },
    input:{
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        color:"#121212",
        borderRadius:10,
    },
    inputsButtons:{
        flexDirection: 'row',
        justifyContent:'space-between',
        width: '100%',
        marginBottom: 10,
    },
    buttonText:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    closeButton:{
        marginTop: 15,
        backgroundColor: '#4ac578',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    btnModalFLEX:{
        flexDirection: 'row',
        justifyContent:'space-between',
        width: '100%',
        marginBottom: 10,
    },
    icon:{
        margin: 5,
    }

});
