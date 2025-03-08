import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView , Platform, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from './jwt';
import  {cadastrarMissao, buscarMissoes} from '../services/missao'

const { height } = Dimensions.get('window');

export default function Home() {
    const [missao, setMissao] = useState(''); 
    const [estado, setEstado] = useState('');
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
    const [missoes, setMissoes] = useState([]);
    useEffect(() => {

        const carregarMissoes = async () => {
            const token = await AsyncStorage.getItem('userToken');
            try {
                const data = await buscarMissoes(token);
                setMissoes(data);
            } catch (error) {
                console.error('Erro ao buscar missões:', error);
            }
        };

        carregarMissoes();
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
                username: user.name
            }, token)
            Alert.alert('Sucesso!', 'Missão cadastrada com sucesso!');
            setCidade('');
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
        <ScrollView>
            {missoes.length > 0 ? (
                missoes.map((missao) => (
                    <View key={missao.id} style={styles.card}>
                        <Text style={styles.title}>Missão: {missao.missao}</Text>
                        <Text>Estado: {missao.estado}</Text>
                        <Text>Cidade: {missao.cidade}</Text>
                        <Text>Início: {new Date(missao.data_inicio_prevista).toLocaleDateString()}</Text>
                        <Text>Final: {new Date(missao.data_final_prevista).toLocaleDateString()}</Text>
                        <Text>Criado por: {missao.username}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>Nenhuma missão encontrada</Text>
            )}
        </ScrollView> 
            <TouchableOpacity style={styles.footer} onPress={toggleView}>
                <Text style={styles.buttonText}>{visible ? 'FECHAR' : '+ ADICIONAR MISSÃO'}</Text>
            </TouchableOpacity>
            {visible && (
                <Animated.View style={[styles.slideUpView, { transform: [{ translateY: slideAnim }] }]}>
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
                    </View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // alignItems: "center",
        justifyContent: 'flex-end',  // Garante que o conteúdo vai para o fundo da tela
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
    slideUpView: {
        position: 'absolute',
        bottom: 70,  // Ajusta para começar acima do footer fixo
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        // borderWidth: 1,
        borderTopColor: '',

    },
    CardLogin: {
        marginTop: 10,
        padding: 16,
        borderRadius: 10,
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
    
    content:{
        padding: 10,
        width: '100%',
        backgroundColor: '#fff',
    },
    cardInfo:{
        margin: 10,
        backgroundColor: '#a2564a',
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
        backgroundColor: '#E20022',
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
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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

});
