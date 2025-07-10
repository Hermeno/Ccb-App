 import React, { useState, useEffect } from 'react';
 import { View, Text,  StyleSheet,TextInput, TouchableOpacity, Alert ,Button, Platform, Modal, KeyboardAvoidingView, ScrollView} from 'react-native';
 import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
 import { Link, useRouter,useLocalSearchParams  } from 'expo-router';
 import { cadastrarCambio } from '../services/cambio';
 import { Picker } from '@react-native-picker/picker';
 import { buscarCreditos } from '../services/despesas';
 import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
 import { useJwt } from './jwt'
 import AsyncStorage from '@react-native-async-storage/async-storage';
 
 export default function Cambio () 
 {
     const router = useRouter();
     const user = useJwt();
     const [cotacao, setCotacao] = useState('');
     const [moeda_origem, setMoeda_origem] = useState('');
     const [moeda_destino, setMoeda_destino] = useState('');
     const [total_a_cambiar, setTotal_a_cambiar] = useState('');
     const [total_cambiado, setTotal_cambiado] = useState('');
     const [numero_recibo, setNumero_recibo] = useState('');
     const [creditos, setCreditos] = useState([]);
     const [outraMoeda, setOutraMoeda] = useState('');
     const [loading, setLoading] = useState(false);
const [mostrarCampoOutra, setMostrarCampoOutra] = useState(false);

const [modalVisible, setModalVisible] = useState(false);
const [modalDestinoVisible, setModalDestinoVisible] = useState(false);
const handleSelecionarMoedaOrigem = (moeda) => {
  setMoeda_origem(moeda);
  setModalVisible(false); // fecha o modal após selecionar
};




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
  const carregarCreditos = async () => {
    if (!missaoId) return; 
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = await buscarCreditos(token, missaoId);
      setCreditos(data || []);
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
      setCreditos([]);
    }
  };

  carregarCreditos();
}, [missaoId]);
 
     const handleCambio = async () =>{
      if (loading) return; // Evita múltiplos envios
          setLoading(true);
         const token = await AsyncStorage.getItem('userToken'); 
         if (!user) {
             Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
             return;
         }
         if (!moeda_origem ||!moeda_destino ||!cotacao ||!total_a_cambiar ||!numero_recibo) { 
             Alert.alert('Erro', 'Todos os campos precisam ser preenchidos.');
             return;
         }
         try{
             const response = await cadastrarCambio ({
                 moeda_origem,
                 moeda_destino,
                 cotacao,
                 total_a_cambiar,
                 total_cambiado,
                 numero_recibo,
                 missao_id:missaoId
             }, token)
             if(response.status === 200) {
                 Alert.alert('Cambio realizado com sucesso!');
                 setCotacao('');
                 setMoeda_destino('');
                 setMoeda_origem('');
                 setTotal_a_cambiar('');
                 setTotal_cambiado('');
                 setNumero_recibo('');

                 const cambioId = response.data.cambio.id; // Acesse o campo 'id' dentro de 'cambio'
                 router.push(`/camera?id_post=${cambioId}`);


             }

         }catch (error: unknown) {
            console.log('Erro ao cadastrar câmbio:', error);
    
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                const errorMessage = err.response?.data?.message || 'Erro desconhecido ao cadastrar câmbio.';
                Alert.alert('Erro ao cadastrar câmbio', errorMessage);
            } else {
                Alert.alert('Erro ao cadastrar câmbio', 'Erro desconhecido ao cadastrar câmbio.');
            }
        }
          finally {
            setLoading(false);
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
function capitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}




     return(


    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80} >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" >




         <View style={styles.container}>
             <View style={styles.CardLogin}>                
             <View style={styles.ViewFlex}>



            <View style={styles.ViewInput}>
            <Text style={styles.TextInputs}>Moeda a debitar:</Text>
            <TouchableOpacity  onPress={() => setModalVisible(true)}  style={styles.abrirModalBotao}>  
              <Text style={styles.abrirModalTexto}>  {moeda_origem ? `Selecionada: ${moeda_origem}` : 'Selecionar moeda'}  </Text>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.TextInputs}>Escolha a moeda:</Text>
                    <View style={styles.modalContent}>
                      {creditos.map((credito, idx) => (
                        <TouchableOpacity
                          key={credito.id ? credito.id : idx}
                          onPress={() => handleSelecionarMoedaOrigem(credito.moeda)}
                          style={[styles.botaoMoeda, moeda_origem === credito.moeda && styles.botaoSelecionado]}>
                          <Text style={styles.botaoTexto}>
                            {`${Number(credito.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${moedaEmPortugues(credito.moeda)})`}
                            {moeda_origem === credito.moeda ? ' ✅' : ''}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.fecharModalBotao}>
                    <Text style={styles.fecharModalTexto}>Fechar</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
            </View>




        <View style={styles.ViewInput}>
  <Text style={styles.TextInputs}>Moeda de Destino:</Text>

  <TouchableOpacity
    onPress={() => setModalDestinoVisible(true)}
    style={styles.abrirModalBotao}>
    <Text style={styles.abrirModalTexto}>
      {moeda_destino
        ? `Selecionada: ${moeda_destino === 'outra' ? outraMoeda : moeda_destino}`
        : 'Selecionar moeda'}
    </Text>
  </TouchableOpacity>

  <Modal animationType="slide" transparent={true} visible={modalDestinoVisible} onRequestClose={() => setModalDestinoVisible(false)}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.TextInputs}>Escolha a moeda de destino:</Text>

        <View style={styles.modalContent}>
          {[
            { label: 'Dólar', value: 'dolar' },
            { label: 'Real', value: 'real' },
            { label: 'Metical', value: 'metical' },
            { label: 'Euro', value: 'euro' },
            { label: 'Libra', value: 'libra' },
            { label: 'Iene', value: 'iene' },
            { label: 'Outra', value: 'outra' }, // Adiciona opção "Outra"
          ].map((moeda) => (
            <TouchableOpacity key={moeda.value} onPress={() => {
                if (moeda.value === 'outra') {
                  setMostrarCampoOutra(true);
                } else { setMoeda_destino(moeda.value); setMostrarCampoOutra(false); setModalDestinoVisible(false);
                }
              }}
              style={[ styles.botaoMoeda, moeda_destino === moeda.value && styles.botaoSelecionado,]}
            >
              <Text style={styles.botaoTexto}> {moeda.label} {moeda_destino === moeda.value ? ' ✅' : ''}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mostrarCampoOutra && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.TextInputs}>Digite a moeda:</Text>
            <TextInput style={styles.input} value={outraMoeda} onChangeText={setOutraMoeda} placeholder="Digite a moeda"
                onSubmitEditing={() => {setMoeda_destino(outraMoeda);setModalDestinoVisible(false);setMostrarCampoOutra(false); }}
            />
            <TouchableOpacity  style={styles.fecharModalBotao}
              onPress={() => { setMoeda_destino(outraMoeda); setModalDestinoVisible(false); setMostrarCampoOutra(false);}}>
              <Text style={styles.fecharModalTexto}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => { setModalDestinoVisible(false); setMostrarCampoOutra(false);}}
          style={styles.fecharModalBotao}
        >
          <Text style={styles.fecharModalTexto}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
</View>







             </View>
 
             <View style={styles.ViewFlex}>
                 <View style={styles.ViewInput}>
                 <Text style={styles.TextInputs}>Cotação</Text>
                 <TextInput  value={cotacao} onChangeText={setCotacao} style={styles.input} placeholder='Cotação' keyboardType="numeric"  />
                 </View>
                 <View style={styles.ViewInput}>
                 <Text style={styles.TextInputs}>Total a Cambiar</Text>
                 <TextInput  value={total_a_cambiar} onChangeText={setTotal_a_cambiar} style={styles.input} placeholder='Total a Cambiar' keyboardType="numeric" />
                 </View>
             </View>
             <View style={styles.ViewFlex}>
                 <View style={styles.ViewInput}>
                 <Text style={styles.TextInputs}>Total Cambiado</Text>
                 <TextInput  value={total_cambiado} onChangeText={setTotal_cambiado} style={styles.input} placeholder='Total Cambiado' keyboardType="numeric"  />
                 </View>
                 <View style={styles.ViewInput}>
                 <Text style={styles.TextInputs}>N do Recibo</Text>
                 <TextInput  value={numero_recibo} onChangeText={setNumero_recibo} style={styles.input} placeholder='N do Recibo' />
                 </View>
             </View>
                 {/* <TouchableOpacity style={styles.BotaoLogin} onPress={handleCambio}>
                     <Text style={styles.TextBotao}>ADICIONAR VALOR CAMBIADO</Text>
                 </TouchableOpacity> */}

                  <TouchableOpacity
                    style={[styles.BotaoLogin, loading && { opacity: 0.6 }]}
                    onPress={handleCambio}
                    disabled={loading}
                  >
                    <Text style={styles.TextBotao}>
                      {loading ? 'Cadastrando...' : 'ADICIONAR VALOR CAMBIADO'}
                    </Text>
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
         backgroundColor: "#FFF",
         justifyContent: "center",
         alignItems: "center",
     },

     CardLogin:{
         width: '100%',
         flex:1,
         backgroundColor: "#fff",
         padding: 20,
         justifyContent: "center",
         alignItems: "center",
         marginTop:-100,
     },
     input:{
         marginBottom: 10,
         paddingLeft: 20,
         borderWidth: 1,
         borderColor: "#ccc",
         // width: "100%",
         color:"#121212",
         backgroundColor: '#f0f0f0',
         height:40,
     },
     TextInputs:{
         marginBottom: 10,
         borderColor: "#121212",
         width: "100%",
         fontSize: 16,
                 color:"#121212",
                 fontWeight: "bold",
             textAlign: "left",
             marginTop: 10,
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
         marginTop: 10,
         marginBottom: 20,
     },
     TextNaoPossuiConta:{
         marginTop: 20,
         color: "#ffffff",
         fontSize: 18,
         fontWeight: "500",
 
     },
     TextRecuperarSenha:{
         color: "#ffffff",
         fontSize: 16,
         fontWeight: "500",
         borderWidth: 1,
         borderColor: "#ccc",
         padding: 5,
         width: "100%",
         height: "15%",
         justifyContent: "center",
         alignItems: "center",
         marginTop: 0,
         marginBottom: 20,
     },
     LinkRecuperarSenha:{
         justifyContent: "center",
         alignItems: "center", 
         color: "#ffffff"      
     },
     TextBotao:{
         color: "#ffffff",
         fontSize: 17,
         fontWeight: "bold",
     },
     containerLines: {
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'center',
         marginVertical: 20,
     },
     line: {
         height: 1,
         backgroundColor: '#00835f',  // Cor da linha
         flex: 1,  // Isso faz a linha ocupar o espaço restante
     },
     text: {
         marginHorizontal: 10,  // Espaçamento entre o texto e as linhas
         fontSize: 16,
         fontWeight: 'bold',
         color: '#000',  // Cor do texto
     },
     label: {
         fontSize: 16,
         marginBottom: 8,
     },
     picker: {
         height: 50,
         width: '100%',
         backgroundColor: '#f0f0f0',
     },
     result: {
         marginTop: 20,
         fontSize: 16,
         fontWeight: 'bold',
         color: '#00835f',
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
     botaoAdicionaImageRecibo:{
         width: '100%',
         height: 40,
         backgroundColor: "#f0f0f0",
         justifyContent: "center",
         alignItems: "center",
         borderRadius: 3,
         marginTop: 10,
         marginBottom: 20,
         borderWidth: 1,
         borderColor: "#ccc",
     },
     footer: {
         position: 'absolute', // Fixa o footer
         bottom: 0,            // Cola no rodapé
         width: '100%',        // Ocupa a largura toda
         height: 70,           // Altura mínima de 70
         backgroundColor: '#fafafa',
         // borderTopWidth: 1,
         // borderTopColor: '#ccc',
         alignItems: 'center',
         zIndex: 1,  // Garantir que o footer esteja acima da Animated View
         display: 'flex',
         flexDirection: 'row',
         paddingHorizontal: 10,
         justifyContent: 'space-between',
         padding:10,
     },
     profile:{
         width: 100,
         height: 50,
         backgroundColor: '#a2564a',
         borderRadius: 20,
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.8,
         shadowRadius: 2,
         elevation: 2,
         justifyContent: 'center',
         alignItems: 'center',
         color: '#fff',
         fontSize: 16,
         fontWeight: 'bold',
         marginLeft: 10,
         padding: 10,
         marginBottom: 5,
     },
     message: {
         textAlign: 'center',
         paddingBottom: 10,
       },
       camera: {
         flex: 1,
       },
       buttonContainer: {
         flex: 1,
         flexDirection: 'row',
         backgroundColor: 'transparent',
         margin: 64,
       },
       button: {
         flex: 1,
         alignSelf: 'flex-end',
         alignItems: 'center',
       },




linha: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
},


botaoTexto: {
  fontSize: 14,
},



modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  backgroundColor: '#fff',
//   borderRadius: 18,
  padding: 20,
  width: '85%',
  maxHeight: '80%',
},
modalContent: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginVertical: 10,
},
botaoMoeda: {
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  margin: 5,
},
botaoSelecionado: {
  backgroundColor: '#d0f0c0',
},
abrirModalBotao: {
  backgroundColor: '#007AFF',
  padding: 15,
//   borderRadius: 5,
  marginTop: 10,
},
abrirModalTexto: {
  color: '#fff',
  textAlign: 'center',
},
fecharModalBotao: {
  marginTop: 20,
  padding: 10,
  backgroundColor: '#bc5a66',
  borderRadius: 0,
},
fecharModalTexto: {
  textAlign: 'center',
  color: '#fff',
},



 })
  
  
  