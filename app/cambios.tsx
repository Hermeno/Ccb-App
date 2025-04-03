import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarCabiosOneByOne } from '../services/cambio';
import { useJwt } from './jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const router = useRouter();
    const user = useJwt();
    const [cambios, setCambios] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = useLocalSearchParams();
    const { missao_id, missao_name } = params;

    useEffect(() => {
        const carregarCambios = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarCabiosOneByOne(token, missao_id);
                setCambios(data || []);
            } catch (error) {
                console.error('Erro ao carregar câmbios:', error);
                setCambios([]);
            } finally {
                setLoading(false);
            }
        };

        if (missao_id) {
            carregarCambios();
        } else {
            setLoading(false);
        }
    }, [missao_id]);









    const baixarFotos = (idCambio: string) => {
        console.log(`Baixando fotos para o câmbio ID: ${idCambio}`);
        router.push(`./imagecambio?id_post=${idCambio}&missao_id=${missao_id}&missao_name=${missao_name}`)
    };

    // Função para atualizar câmbio
    // const atualizarCambio = (idCambio: string) => {
    //     console.log(`Atualizando câmbio ID: ${idCambio}`);
    //     // Lógica para atualizar as informações do câmbio
    // };








    return (
        <View style={styles.container}>
            {/* {user ? (
                <Text style={styles.TextHeaderLogin}>Olá, {user.name}!</Text>
            ) : (
                <Text style={styles.TextHeaderLogin}>Carregando...</Text>
            )} */}

            <View style={styles.CardLogin}>
                {loading ? (
                    <ActivityIndicator size="large" color="#487d76" />
                ) : (
                    <>
                        {missao_id && (
                            <View style={styles.cardSection}>
                                
                                {Array.isArray(cambios) && cambios.length > 0 ? (
                                    <ScrollView>
                                        {cambios.map((cambio, index) => (
                                            // <Text style={styles.TextSectionTitle}>Câmbios Realizados</Text>
                                            <View key={index} style={styles.cardItem}>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Moeda: </Text>
                                                    {cambio.moeda_origem} para {cambio.moeda_destino}
                                                </Text>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Cotação: </Text>
                                                    {cambio.cotacao}
                                                </Text>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Total a Cambiar: </Text>
                                                    {cambio.total_a_cambiar}
                                                </Text>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Total Cambiado: </Text>
                                                    {cambio.total_cambiado}
                                                </Text>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Número do Recibo: </Text>
                                                    {cambio.numero_recibo}
                                                </Text>




                                                <View style={styles.buttonContainer}>
                                                    <Button
                                                        title="Baixar Foto"
                                                        onPress={() => baixarFotos(cambio.id)}
                                                    />
                                                    {/* <Button
                                                        title="Atualizar"
                                                        onPress={() => atualizarCambio(cambio.id)}
                                                    /> */}
                                                </View>










                                            </View>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <Text style={styles.noDataText}>Sem câmbios registrados para esta missão.</Text>
                                )}

                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    TextHeaderLogin: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#487d76",
        marginBottom: 20,
    },
    CardLogin: {
        width: '100%',
        // flex: 1,
        // backgroundColor: "#FFF",
        // borderRadius: 10,
        padding: 10,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
    },
    cardSection: {
        marginBottom: 20,
        width: '100%',
    },
    TextSectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#121212",
        marginBottom: 15,
    },
    cardItem: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        // shadowColor: "#000",
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // elevation: 3,
    },
    cardItemTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
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
    noDataText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    buttonContainer: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    // noDataText: {
    //     fontSize: 16,
    //     color: "#666",
    //     textAlign: "center",
    // },
});
