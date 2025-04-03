import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, ScrollView, StyleSheet,TouchableOpacity  } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';

const Imagens = () => {
  const { id_post, missao_id, missao_name  } = useLocalSearchParams();
  const [images, setImages] = useState<string[]>([]);

  const getPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar arquivos foi negada');
    }
  };

  const fetchImages = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await fetch(`https://api-com-nodejs-express-mongodb-prisma.onrender.com/fotos-despesas/${id_post}`, {
        // const response = await fetch(`http://192.168.43.226:3000/fotos-despesas/${id_post}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        

      if (!response.ok) {
        throw new Error(`Erro ao buscar imagens: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      // ✅ Extrair caminhos das imagens
      const paths = data.flatMap((item) =>
        item.fotos.map((foto) => `https://api-com-nodejs-express-mongodb-prisma.onrender.com/uploads/${foto}`)
      );

      setImages(paths);
    } catch (error) {
      // console.error('Erro ao buscar imagens:', error);
      Alert.alert('Sem imagens.');
    }
  };

  const downloadImage = async (url: string) => {
    try {
      const filename = url.split('/').pop();
      const downloadUri = `${FileSystem.documentDirectory}${filename}`;

      const { uri } = await FileSystem.downloadAsync(url, downloadUri);
      console.log('Imagem baixada para:', uri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Camera');

      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Camera', asset, false);
      }

      console.log('Imagem salva na galeria!');
      Alert.alert('Sucesso', 'Imagem salva na galeria!');
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
      Alert.alert('Erro ao baixar imagem.');
    }
  };

  useEffect(() => {
    getPermission();
    fetchImages();
  }, []);

  return (
<ScrollView style={styles.container}>
  <Text style={styles.title}>Imagens da Despesa</Text>
  {images.map((image, index) => (
    <View key={index} style={styles.imageContainer}>
      {/* <Text style={styles.imageLabel}>Imagem {index + 1}</Text> */}
      <Image source={{ uri: image }} style={styles.image} />
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => downloadImage(image)}
      >
        <Text style={styles.downloadButtonText}>Baixar Imagem</Text>
      </TouchableOpacity>
    </View>
  ))}
</ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    // elevation: 3, // sombra para Android
    // shadowColor: '#000', // sombra para iOS
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageLabel: {
    fontSize: 16,
    color: '#555',
    marginVertical: 8,
    textAlign: 'center',
  },
  downloadButton: {
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default Imagens;
