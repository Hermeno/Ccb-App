import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert,  ScrollView, Button, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarCabiosOneByOne, deleteCambio } from '../services/cambio';
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

//   const atualizarCambio = (idCambio: string) => {
    const atualizarCambio = (idCambio: string) => {
        // console.log(`Atualizando câmbio ID: ${idCambio}`);
        router.push(`./updatecambio?idCambio=${idCambio}&missao_id=${missaoId}&missao_name=${missaoName}`);
    }




    const baixarFotos = (idCambio: string) => {
        // console.log(`Baixando fotos para o câmbio ID: ${idCambio}`);
        router.push(`./imagecambio?id_post=${idCambio}&missao_id=${missaoId}&missao_name=${missaoName}`);
    };

const deletarcambio = async (idCambio: string) => {
  try {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja deletar este câmbio?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (!token) throw new Error('Token não encontrado');
              await deleteCambio(missaoId, idCambio, token);
              const data = await buscarCabiosOneByOne(token, missaoId);
              setCambios(data || []);
            } catch (error) {
              console.error('Erro ao deletar câmbio:', error);
              Alert.alert('Erro', 'Não foi possível deletar o câmbio');
            }
          },
        },
      ],
      { cancelable: true }
    );
  } catch (error) {
    console.error('Erro ao mostrar alerta:', error);
  }
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
                                                    {cambio.cotacao / 100}
                                                </Text>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Total a Cambiar: </Text>
                                                    {(cambio.total_a_cambiar / 100) }
                                                </Text>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Total Cambiado: </Text>
                                                    {(cambio.total_cambiado / 100) }
                                                </Text>
                                                <Text style={styles.cardItemText}>
                                                    <Text style={styles.cardItemLabel}>Número do Recibo: </Text>
                                                    {cambio.numero_recibo}
                                                </Text>




                                                <View style={styles.buttonContainer}>
                                                    <TouchableOpacity style={styles.ButtonStyle} onPress={() => atualizarCambio(cambio.id)}>
                                                        <Text style={styles.ButtonText}>Atualizar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.ButtonStyle} onPress={() => baixarFotos(cambio.id)}>
                                                        <Text style={styles.ButtonText}>Fotos</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.deleteButton} onPress={() => deletarcambio(cambio.id)}>
                                                        <Text style={styles.ButtonText}>Deletar</Text>
                                                    </TouchableOpacity>
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
    },
    deleteButton: {
        backgroundColor: "#ff4d4f",
        paddingVertical: 10,    
        paddingHorizontal: 15,
        borderRadius: 8,
    },
});

