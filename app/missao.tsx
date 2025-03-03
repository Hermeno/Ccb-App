import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function Home() {
    const [valor, setValor] = useState('');
    const [visible, setVisible] = useState(false);
    
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
            <Text style={styles.TextHeaderLogin}>Olá, Miqueias! Adicione seu saldo aqui!</Text>

            {/* Botão no Footer */}
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
        alignItems: "center",
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
        height: 50,
    },
    TextInput: {
        marginBottom: 10,
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
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: -3 },
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // elevation: 10,
        borderWidth: 1,
        borderTopColor: '#ccc',

    },
    CardLogin: {
        marginTop: 10,
        padding: 16,
        // backgroundColor: '#f9f449',
        borderRadius: 10,
    },
    TextBotao: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    }
});
