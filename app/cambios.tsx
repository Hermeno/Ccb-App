import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarCabiosOneByOne } from '../services/cambio';
import { buscarMissaoPorId } from '../services/missao';
import { useJwt } from './jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() { 
    const router = useRouter();
    const user = useJwt();
    const [cambios, setCambios] = useState([]);
     const [missao, setMissao] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useLocalSearchParams();

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
        const carregarCambios = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const data = await buscarCabiosOneByOne(token, missaoId);
                setCambios(data || []);
            } catch (error) {
                console.error('Erro ao carregar câmbios:', error);
                setCambios([]);
            } finally {
                setLoading(false);
            }
        };

        if (missaoId) {
            carregarCambios();
        } else {
            setLoading(false);
        }
    }, [missaoId]);




//   useEffect(() => {
//         const carregarMissao = async () => {
//         try {
//             const token = await AsyncStorage.getItem('userToken');
//             if (token && missaoId) {
//             const dados = await buscarMissaoPorId(missaoId, token);
//             console.log('Missão da API:', dados);
//             setMissao(Array.isArray(dados) ? dados[0] : dados);
//             }
//         } catch (error) {
//             console.error('Erro ao carregar missão:', error);
//         } finally {
//             setLoading(false);
//         }
//         };
//     carregarMissao();


//   }, []);




    const baixarFotos = (idCambio: string) => {
        // console.log(`Baixando fotos para o câmbio ID: ${idCambio}`);
        router.push(`./imagecambio?id_post=${idCambio}&missao_id=${missaoId}&missao_name=${missaoName}`);
    };


    return (
        <View style={styles.container}>

            <View style={styles.CardLogin}>
                {loading ? (
                    <ActivityIndicator size="large" color="#487d76" />
                ) : (
                    <>
                        {missaoId && (
                            <View style={styles.cardSection}>
                                
                                {Array.isArray(cambios) && cambios.length > 0 ? (
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {cambios.map((cambio, index) => (
                                            // <Text style={styles.TextSectionTitle}>Câmbios Realizados</Text>
                                            <View key={index} style={styles.cardItem}>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Moeda: </Text>({cambio.moeda_destino})   
                                                    
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
        backgroundColor: "#f0f2f5",
        padding: 16,
    },
    CardLogin: {
        width: '100%',
        padding: 10,
    },
    cardSection: {
        marginBottom: 20,
        width: '100%',
    },
    cardItem: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3, // para Android
    },
    cardItemText: {
        fontSize: 15,
        color: "#444",
        marginBottom: 8,
    },
    cardItemLabel: {
        fontWeight: "bold",
        color: "#487d76",
    },
    noDataText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 10,
    },
    ButtonStyle: {
        backgroundColor: "#487d76",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    ButtonText: {
        color: "#fff",
        fontWeight: "600",
    }
});

