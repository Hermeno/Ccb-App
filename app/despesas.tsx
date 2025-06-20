import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert, Platform, Button, Modal, FlatList, Image, KeyboardAvoidingView, ScrollView  } from 'react-native';
import { Link, useRouter, useLocalSearchParams   } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { cadastrarDespesa, buscarCreditos } from '../services/despesas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useJwt } from './jwt'

export default function Home () 
{
    const router = useRouter();
    const user = useJwt();
    const [valor, setValor] = useState('');
    const { missao_id, missao_name } = useLocalSearchParams();
    const [cidade, setCidade] = useState('');
    const [outro, setOutro] = useState('');
    const [showOutro, setShowOutro] = useState(false);
    const [data_padrao, setData_padrao] = useState(new Date());
    const [showInicio, setShowInicio] = useState(false);
    const showdata_padrao = () => setShowInicio(true);
    const [numero_recibo, setNumero_recibo] = useState('');
    const [foto_recibo, setFoto_recibo] = useState('');
    const [moeda, setMoeda] = useState('');
    const [descricao, setDescricao] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [parsedPhotos, setParsedPhotos] = useState<string[]>([]);
    const [creditos, setCreditos] = useState([]);

const [modalMoedaVisible, setModalMoedaVisible] = useState(false);


    useEffect(() => {
        const carregarCreditos = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const data = await buscarCreditos(token, missao_id);
            console.log(missao_id)
            setCreditos(data);
          } catch (error) {
            console.error('Erro ao carregar créditos:', error);
          }
        };
    
        carregarCreditos();
      }, []);



    const opcoes = [
        { id: '1', label: 'Almoço' },
        { id: '3', label: 'Atendimento' },
        { id: '2', label: 'Bilhete Aerea' },
        { id: '4', label: 'Cafe de Manhá' },
        { id: '5', label: 'Hospedagem' },
        { id: '6', label: 'Janta' },
        { id: '7', label: 'Lanche' },
        { id: '8', label: 'Medicamentos' },
        { id: '9', label: 'Taxi / Uber' }
    ];
    const handleSelectItem = (item: string) => {
        setOutro(''); // Limpa o campo "Outro"
        setDescricao(item); // Define a descrição
        setModalVisible(false); // Fecha o modal automaticamente
    };
    


    const OPENCAMERA = () => {
        router.push({
          pathname: '/camera',
          params: { missao_id:missao_id }
        });
      };
      
      const handleDespesa = async () => {
        const token = await AsyncStorage.getItem('userToken');
      
        if (!user) {
            Alert.alert('Usuário não identificado. Faça login novamente.');
            return;
        }
    
        if (!valor || !cidade || !numero_recibo) {
            Alert.alert('Todos os campos precisam ser preenchidos.');
            return;
        }
    
        if ((Array.isArray(descricao) && descricao.length === 0) && !outro) {
            Alert.alert('Pelo menos uma categoria ou outro campo precisa ser preenchido.');
            return;
        }
    
        try {
            const response = await cadastrarDespesa({
                moeda,
                valor,
                cidade,
                descricao,
                outro,
                data_padrao,
                numero_recibo, 
                missao_id
            }, token);
    
            if (response && response.dispesas) {
                const despesaId = response.dispesas.id;
                console.log('Despesa ID:', despesaId);
    
                if (despesaId) {
                    router.replace(`/cameradespesas?id_post=${despesaId}`);
                }
    
                Alert.alert('Sucesso!', 'Despesa cadastrada com sucesso!');
                setValor('');
                setCidade('');
                setOutro('');
                setNumero_recibo('');
                setFoto_recibo('');
                setMoeda('');
                setDescricao('');
                setParsedPhotos([]);
            }
        } catch (error: unknown) {
            console.log('Erro ao cadastrar despesa:', error);
    
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                const errorMessage = err.response?.data?.message || 'Erro desconhecido ao cadastrar despesa.';
                Alert.alert('Erro ao cadastrar despesa', errorMessage);
            } else {
                Alert.alert('Erro ao cadastrar despesa', 'Erro desconhecido ao cadastrar despesa.');
            }
        }
    };
    
    
    




    const onChangedata_padrao = (event: any, selectedDate?:Date) => {
        const currentDate = selectedDate || data_padrao;
        setShowInicio(Platform.OS === 'ios' ? true : false);
        setData_padrao(currentDate);
    };





    return(

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // ajuste conforme o header do seu app
    >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >

        <View style={styles.container}>            
            <View style={styles.CardLogin}> 

          <View style={stylesMoedaContainer.container}>
            <Text style={stylesMoedaContainer.label}>Moeda</Text>

            <TouchableOpacity onPress={() => setModalMoedaVisible(true)} style={styles.botaoAbrirrrrrr}>
              <Text style={stylesMoedaContainer.textoAbrir}>
                {moeda ? `Selecionada: ${moeda}` : 'Selecionar moeda'}
              </Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalMoedaVisible}
              onRequestClose={() => setModalMoedaVisible(false)}
            >
              <View style={stylesMoedaContainer.modalFundo}>
                <View style={stylesMoedaContainer.modalBox}>
                  <Text style={stylesMoedaContainer.label}>Escolha a moeda:</Text>

                  <View style={stylesMoedaContainer.modalLista}>
                    {creditos.map((credito) => (
                      <TouchableOpacity
                        key={credito.id}
                        onPress={() => {
                          setMoeda(credito.moeda);
                          setModalMoedaVisible(false);
                        }}
                        style={[
                          stylesMoedaContainer.itemBotao,
                          moeda === credito.moeda && stylesMoedaContainer.itemSelecionado,
                        ]}
                      >
                        <Text style={stylesMoedaContainer.itemTexto}>
                          {`${credito.moeda} - R$ ${(Number(credito.valor) || 0).toFixed(2)}`}
                          {moeda === credito.moeda ? ' ✅' : ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity onPress={() => setModalMoedaVisible(false)} style={stylesMoedaContainer.botaoFechar} >
                    <Text style={stylesMoedaContainer.textoFechar}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>


               
            <View style={styles.ViewFlex}>
                <View style={styles.ViewInputOne} >
                <Text style={styles.TextInput}>Selecione a data Padrão</Text>
                    <Button  onPress={showdata_padrao} title="Escolher data padrão" />
                        <Text  style={styles.textoEscolhido}>{data_padrao.toLocaleDateString()}</Text>
                        {showInicio && (
                            <DateTimePicker value={data_padrao} mode="date" display="default" onChange={onChangedata_padrao} />
                        )}
                </View>
            </View>


            <View  style={styles.ViewFlex}>
                <View style={styles.ViewInputOne}>
                <Text style={styles.TextInputs}>Cidade</Text>
                <TextInput  value={cidade} onChangeText={setCidade} style={styles.inputOne} placeholder='Cidade'  />
                </View>
            </View>


            <View style={styles.ViewFlex}>









            <View style={styles.ViewInputOne}>
                <Text style={styles.TextInputs}>Descrição</Text>
                <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
                    <Text>
                        {descricao.length > 0 ? descricao : 'Selecione uma opção ou escreva outra'}
                    </Text>
                </TouchableOpacity>
            </View>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={opcoes}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        descricao.includes(item.label) && styles.optionSelected
                                    ]}
                                    onPress={() => handleSelectItem(item.label)}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                            <View>
                            {showOutro && (
                                    <View style={styles.ViewInputOne}>
                                        <Text style={styles.TextInputs}>Outro</Text>
                                        <TextInput
                                            value={outro}
                                            onChangeText={(text) => {
                                                setOutro(text);
                                                setDescricao(text); // Atualiza descricao com o valor do "Outro"
                                            }}
                                            style={styles.inputOne}
                                            placeholder="Digite outra descrição"
                                        />
                                    </View>
                                )}
                                <TouchableOpacity style={styles.Outro} onPress={() => setShowOutro(!showOutro)}>
                                    <Text>{showOutro ? 'Fechar Outro' : 'Outro'}</Text>
                                </TouchableOpacity>
                            </View>
                        <View>
                            {/* <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity> */}

                        </View>
                    </View>
                </View>
            </Modal>   

























            </View>



            <View style={styles.ViewFlex}>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>Valor</Text>
                <TextInput  value={valor} onChangeText={setValor} style={styles.input} placeholder='Valor' keyboardType="numeric"  />
                </View>
                <View style={styles.ViewInput}>
                <Text style={styles.TextInputs}>N do Recibo</Text>
                <TextInput  value={numero_recibo} onChangeText={setNumero_recibo} style={styles.input} placeholder='N do Recibo' />
                </View>
            </View>


                {parsedPhotos && parsedPhotos.length > 0 ? (
                <FlatList
                    style={styles.flatL}
                    data={parsedPhotos}
                    keyExtractor={(item, index) => index.toString()} // Usando o índice como chave para garantir unicidade
                    horizontal
                    renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.imagePreview} />
                    )}
                />
                ) : (
                <Text style={styles.TextAnexarImagem}></Text>
                )}






                <TouchableOpacity style={styles.BotaoLogin} onPress={handleDespesa}>
                    <Text style={styles.TextBotao}>CADASTRAR DESPESA</Text>
                </TouchableOpacity>

            </View>
        </View>



            </ScrollView>
          </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    CardLogin:{
        width: '100%',
        // height: 400,
        flex:1,
        backgroundColor: "#ffffff",
        // borderRadius: 30,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        // borderTopEndRadius: 40,
        // borderTopStartRadius: 40,
        borderWidth:1,
        borderColor: "#ccc",
    },
    input:{
        marginBottom: 10,
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        // width: "100%",
        color:"#121212",
        backgroundColor: '#f0f0f0',
        height:45,
        borderRadius:0,
    },
    TextInputs:{
        marginBottom: 3,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            textAlign: "left",
            marginTop: 0,
    },

    TextAnexarImagem:{
        marginBottom: 10,
        borderColor: "#121212",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            marginTop: 10,
    },

    BotaoLogin:{
        width: "100%",
        height: 50,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        // marginTop: 10,
        marginBottom: 20,
    },

    TextBotao:{
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "bold",
    },
    // picker: {
    //     height: 50,
    //     width: '100%',
    //     backgroundColor: '#f0f0f0',
    // },
    result: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },  
    ViewFlex:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 20,
        width: '100%',
        columnGap: '10',
        marginTop:10,
    },
    ViewInput:{
        width: '48%',
        marginBottom: 1,
    },    
    ViewInputOne:{
        width: '100%',
        marginBottom: 1,
    },
    botaoAdicionaImageRecibo:{
        width: '100%',
        height: 40,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        marginTop: 10,
        // marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    TextInput:{
        marginBottom: 10,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
            textAlign: "left",
            marginTop: 10,
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
    inputOne:{
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        color:"#121212",
        backgroundColor: '#f0f0f0',
        height:50,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
    },
    optionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionSelected: {
        backgroundColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 40,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    }, 
    Outro: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
        borderWidth:1,
        borderColor: '#ccc',
    } ,
    flatL:{
        display: 'flex',
        flexDirection: 'row',
        // height: 10,
        marginBottom: 10,
        width: '100%',
        flexWrap: 'wrap',
        paddingTop: 10,
    },
    imagePreview: {
        width: 50,
        height: 50,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    pickerContainer: {
  marginBottom: 20,
  width: '100%',
},

pickerWrapper: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  overflow: 'hidden',
  backgroundColor: '#fff',
  height: Platform.OS === 'ios' ? 200 : 50, // aumenta altura no iOS
  justifyContent: 'center',
},

item: {
  padding: 7,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginVertical: 4,
  backgroundColor: '#fff',
},

itemSelecionado: {
  backgroundColor: '#cce5ff',
  borderColor: '#007bff',
},

itemTexto: {
  fontSize: 16,
},



modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

botaoAbrirrrrrr:{
    backgroundColor: '#3498db',
  padding: 10,
  borderRadius: 5,
  width: '100%',           // ocupa 100% da largura disponível do container
  // alignSelf: 'stretch',
  borderWidth:0,
}
});




const stylesMoedaContainer = StyleSheet.create({
  container: {
    marginVertical: 10,
    width:'100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
botaoAbrir: {
  backgroundColor: '#3498db',
  padding: 10,
  borderRadius: 5,
  width: '100%',           // ocupa 100% da largura disponível do container
  alignSelf: 'stretch',    // garante que ele se estique (pode ser opcional)
},

  textoAbrir: {
    color: '#fff',
    textAlign: 'center',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
  },
  modalLista: {
    marginTop: 10,
  },
  itemBotao: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemSelecionado: {
    backgroundColor: '#d0f0c0',
  },
  itemTexto: {
    fontSize: 16,
  },
  botaoFechar: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#777',
    borderRadius: 5,
  },
  textoFechar: {
    textAlign: 'center',
    color: '#fff',
  },
});
