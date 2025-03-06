import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView , Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const { height } = Dimensions.get('window');

export default function Home() {
    const [valor, setValor] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const [showInicioPicker, setShowInicioPicker] = useState(false);

    const formatarData = (data: any) => {
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const handleInicioChange = (event: any, selectedDate?: Date) => {
        setShowInicioPicker(false);
        if (selectedDate) {
            setDataInicio(formatarData(selectedDate));
        }
    };



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
            setVisible(true);  // Define que está visível
            Animated.timing(slideAnim, {
                toValue: height / 4,  // Ajuste o valor conforme o tamanho que deseja
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

{/* 
            <View>
                <TouchableOpacity style={styles.button} onPress={back}>
                    <Text style={styles.buttonText}>VOLTAR</Text>
                </TouchableOpacity>
            </View> */}



                    <View style={styles.content}>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM REAIS</Text>
                            <Text style={styles.text_saldo}>R$: 981,00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM DOLAR</Text>
                            <Text style={styles.text_saldo}>U$: 125,00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM EURO</Text>
                            <Text style={styles.text_saldo}>E$: 3312,00</Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM METICAIS</Text>
                            <Text style={styles.text_saldo}>MZN$: 1300,00</Text>
                        </TouchableOpacity>                
                        <TouchableOpacity style={styles.cardInfo}>
                            <Text style={styles.Textshow}>SALDO EM LIBRAS</Text>
                            <Text style={styles.text_saldo}>EL$: 97,99</Text>
                        </TouchableOpacity>                 
                    </View>
                {/* </View>   */}
                </ScrollView>  





            <TouchableOpacity style={styles.footer} onPress={toggleView}>
                <Text style={styles.buttonText}>{visible ? 'FECHAR' : '+ ADICIONAR MISSÃO'}</Text>
            </TouchableOpacity>

            {/* Animated View que sobe */}
            {visible && (
                <Animated.View style={[styles.slideUpView, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.CardLogin}>

                        <Text style={styles.TextInput}>Valor creditado</Text>
                        <TextInput
                            value={valor}
                            onChangeText={setValor}
                            style={styles.input}
                            placeholder='Valor creditado'
                        />

                        <Text>Data de Início Prevista:</Text>
                        <TouchableOpacity onPress={() => setShowInicioPicker(true)}>
                            <TextInput
                                value={dataInicio}
                                placeholder="Selecione a data"
                                editable={false}
                                style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
                            />
                        </TouchableOpacity>

                        {showInicioPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                                onChange={handleInicioChange}
                            />
                        )}

                    <Text style={styles.TextInput}>Estado / Provincia</Text>
                        <TextInput
                            value={valor}
                            onChangeText={setValor}
                            style={styles.input}
                            placeholder='Estado / Provincia'
                        />
                    <Text style={styles.TextInput}>Cidade</Text>
                        <TextInput
                            value={valor}
                            onChangeText={setValor}
                            style={styles.input}
                            placeholder='Cidade'
                        />








                        <TouchableOpacity style={styles.BotaoLogin}>
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
    dateInput:{
        borderWidth: 1,
        borderColor: '#ccc',
        width: "100%",
        backgroundColor: '#f0f0f0',
        height: 45,
        color: "#000",
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    }

});
