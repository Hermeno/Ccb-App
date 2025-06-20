import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity , Alert} from 'react-native';
import { useRouter,useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarDespesas } from '@/services/despesas';
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
        router.push(`/image?id_post=${id_despesa}`)
    }
      
    const goTo = (id_despesa: string) => {
        router.push({
            pathname: '/updatedespesa',
            params: { id_despesa, missaoId, missaoName }
        });
    }




  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {despesas.length > 0 ? (
          despesas.map((despesa) => (
            <TouchableOpacity key={despesa.id} style={styles.Top}>
              <Text style={styles.TopTitle}>{despesa.descricao}</Text>
              <Text style={styles.cardAmount}>R$ {despesa.valor}</Text>


                <View>
                    <View style={styles.flexSonData}>
                        <TouchableOpacity style={styles.buttonUdate} onPress={ () => goTo(despesa.id)}>
                        <Text style={styles.buttonText}><MaterialIcons name="edit" size={20} color="black" /></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonUdate} onPress={ () => DOWNLOD(despesa.id)}>
                            <Text style={styles.buttonText}>Imagens</Text>
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
    // paddingHorizontal: 16,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    bottom: 0,
    width: '100%',
    position: 'absolute',
    height: '95%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  Top: {
    backgroundColor: '#fff',
    // borderRadius: 12,
    // paddingVertical: 20,
    // paddingHorizontal: 16,
    // marginBottom: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
    // borderWidth: 1,
    // borderColor: '#ddd',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#FF0000',
    marginTop: 20,
  },
  cardTop:{
    margin: 10,
    backgroundColor: 'transparent',
    padding: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 10,
    borderRadius:10
},
titleTop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
},















      flexSonData:{
        flexDirection: 'row',
        justifyContent:'flex-end',
        // margin: 15,
        // width: '100%',
        columnGap: '10',
      },
      inputsButtons:{
        flexDirection: 'row',
        justifyContent:'center',
        // margin: 15,
        // width: '100%',
        columnGap: '10',
      },
      buttonText:{
        color:'#000'
      },
     
      buttonUdate:{
        // width: '25%',
        // backgroundColor: '#4CAF50',
        // padding: 10,
        paddingVertical:5,
        paddingHorizontal:20,
        borderRadius: 288,
        // marginBottom: 10,
        // marginLeft: 10,
        justifyContent: 'center',
        // alignItems: 'center',
        borderWidth:1,
        borderColor: '#ccc',
      },

});

