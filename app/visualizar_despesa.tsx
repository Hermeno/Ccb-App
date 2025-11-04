import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarDespesas, deleteDespesa } from '@/services/despesas';
import * as Sharing from 'expo-sharing';
import { useJwt } from './jwt';

export default function App() {
  const router = useRouter();
  const user = useJwt();

  const [despesas, setDespesas] = useState([]);
  const { missaoId, missaoName } = useLocalSearchParams();

  useEffect(() => {
    const carregarCredito = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const data = await buscarDespesas(token, missaoId);
        setDespesas(data || []);
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      }
    };
    carregarCredito();
  }, [missaoId]);

  const DOWNLOD = (id_despesa: string) => {
    router.push(`/image?id_post=${id_despesa}&missao_id=${missaoId}&missao_name=${missaoName}`);
  };

  const goTo = (id_despesa: string) => {
    router.push({
      pathname: '/updatedespesa',
      params: { id_despesa, missaoId, missaoName },
    });
  };

  

const DELETE = async (id_despesa: string) => {
    try {  // Adicionar try/catch
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja deletar esta despesa?',
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
                            if (!token) {
                                throw new Error('Token não encontrado');
                            }
                            await deleteDespesa(token, id_despesa, missaoId);
                            const data = await buscarDespesas(token, missaoId);
                            setDespesas(data || []);
                        } catch (error) {
                            Alert.alert('Erro', 'Falha ao deletar despesa');
                            console.error(error);
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Falha ao processar a operação');
    }
}









  function capitalizeFirstLetter(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const exportarCSV = async () => {
    if (!despesas.length) {
      Alert.alert('Nenhuma despesa para exportar.');
      return;
    }

    const header = [
      'missao',
      'moeda',
      'valor',
      'cidade',
      'descricao',
      'outro',
      'data_padrao',
      'numero_recibo',
    ];

    const rows = despesas.map((d) => [
      missaoName,
      d.moeda,
      d.valor / 100,
      d.cidade,
      d.descricao,
      d.outro,
      d.data_padrao,
      d.numero_recibo,
    ]);

    const csv = [
      header.join(','),
      ...rows.map((r) => r.map((item) => `"${item ?? ''}"`).join(',')),
    ].join('\n');

    const fileUri = FileSystem.documentDirectory + 'despesas.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Compartilhar arquivo CSV',
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      Alert.alert(
        'Arquivo salvo',
        `Arquivo CSV salvo em:\n${fileUri}\nMas não foi possível compartilhar diretamente.`,
      );
    }
  };

  function moedaEmPortugues(moeda: string) {
    switch (moeda?.toLowerCase()) {
      case 'dolar':
        return 'Dólar';
      case 'real':
        return 'Real';
      case 'metical':
        return 'Metical';
      case 'euro':
        return 'Euro';
      case 'libra':
        return 'Libra';
      case 'iene':
        return 'Iene';
      default:
        return capitalizeFirstLetter(moeda);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.exportButton} onPress={exportarCSV}>
        <Text style={styles.exportButtonText}>Exportar CSV</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {despesas.length > 0 ? (
          despesas.map((despesa) => (
            <TouchableOpacity key={despesa.id} style={styles.Top}>
             <Text style={styles.TopTitle}>
                {despesa.descricao?.length > 12 
                  ? `${despesa.descricao.slice(0, 12)}...` 
                  : despesa.descricao}
              </Text>
              <Text style={styles.cardAmount}>
                {Number(despesa.valor / 100).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}{' '}
                ({moedaEmPortugues(despesa.moeda)})
              </Text>

              <View>
                <View style={styles.flexSonData}>
                  <TouchableOpacity
                    style={styles.buttonUdate}
                    onPress={() => goTo(despesa.id)}
                  >
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="edit" size={20} color="black" />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonUdate} onPress={() => DOWNLOD(despesa.id)} >
                    <Text style={styles.buttonText}>Imagens</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => DELETE(despesa.id)}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="delete" size={20} color="black" />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma despesa encontrada</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#487d76',
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  Top: {
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 3,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#FF0000',
    marginTop: 20,
  },
  exportButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 40,
    borderWidth: 1,
    borderColor: '#fff',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  flexSonData: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  buttonText: {
    color: '#000',
  },
  buttonUdate: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 288,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 2,
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 288,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ff4d4d',
    marginLeft: 3,
  },
    TopTitle: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
    marginLeft:-10,
    marginTop:3,
  },
});
