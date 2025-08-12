import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createfotos } from '../services/cambio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarMissaoPorId } from '../services/missao';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const cameraRef = useRef(null); // Referência para o CameraView
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id_post } = useLocalSearchParams();
  const [missaoId, setMissaoId] = useState<string | null>(null);
  const [missaoName, setMissaoName] = useState('');  
  const [missao, setMissao] = useState<any>(null);
  const [missaofoto, setMissaoFoto] = useState('');
  const [datafoto, setDataFoto] = useState('');

  
    const missao_id = useLocalSearchParams().missao_id;
    const missao_name = useLocalSearchParams().missao_name;


useEffect(() => {
  const carregarMissao = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && missao_id) {
        const dados = await buscarMissaoPorId(missao_id, token);
        let missaoObj = Array.isArray(dados) ? dados[0] : dados;
        setMissao(missaoObj);

        if (missaoObj) {
          setMissaoFoto(missaoObj.missao);
          setDataFoto(missaoObj.data_inicio_prevista);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar missão:', error);
    } finally {
      setLoading(false);
    }
  };

  carregarMissao();
}, []);


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
   
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(); // Usa o ref para acessar o método
      setPhotos((prevPhotos) => [...prevPhotos, photo.uri]);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleDone = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');

    try {
      const response = await createfotos({ fotos: photos, id_post, missaofoto:missaofoto, datafoto:datafoto, missaoId  }, token);

      if (response.status === 200) {
        Alert.alert('Fotos enviadas com sucesso!');
        router.replace(`/home`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar fotos');
    } finally {
      setLoading(false);
    }
  };


return (
  <View style={{ flex: 1 }}>
    <CameraView
      style={StyleSheet.absoluteFill}
      type={facing}
      ref={cameraRef}
    >
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
    </CameraView>

    <View style={styles.photosContainer}>
      {photos.map((photoUri, index) => (
        <Image key={index} source={{ uri: photoUri }} style={styles.photo} />
      ))}
    </View>

    {/* Botão por cima, fixo na parte inferior */}
    <View style={styles.doneButtonContainer}>
      <Button
        title={loading ? 'Enviando...' : 'SALVAR'}
        onPress={handleDone}
        disabled={loading}
      />
    </View>
  </View>
);

// Adicione
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  doneButtonContainer: {
  position: 'absolute',
  bottom: 40,
  left: 0,
  right: 0,
  alignItems: 'center',
  zIndex: 10,
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
    marginBottom: 20,
    backgroundColor: '#00835f',
    padding: 10,
    borderRadius: 20,

  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  realButton: {
  backgroundColor: '#00835f',
  paddingVertical: 14,
  paddingHorizontal: 32,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 4, // sombra Android
  shadowColor: '#000', // sombra iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  marginHorizontal: 10,
},
realButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 1,
},
});
