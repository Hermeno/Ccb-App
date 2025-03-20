import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CameraScreen() {
  const router = useRouter();
  const {  missao_id, missao_name } = useLocalSearchParams();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]); // Array para armazenar múltiplas fotos
  const cameraRef = useRef(null); // Referência para a câmera
  const [parsedPhotos, setParsedPhotos] = useState<{ uri: string; name: string; type: string }[]>([]);


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

  // Função para alternar a câmera
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }


 async function takePhoto() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    const photoName = photo.uri.split('/').pop();

    setParsedPhotos(prevPhotos => [
        ...prevPhotos,
        { 
            uri: photo.uri, 
            name: photoName || `photo_${Date.now()}.jpg`, 
            type: 'image/jpeg' 
        }
    ]);
}
  
const goBackWithPhotos = () => {
  const photosParam = encodeURIComponent(JSON.stringify(photos));
  const missaoIdParam = encodeURIComponent(missao_id ?? '');
  const missaoNameParam = encodeURIComponent(missao_name ?? '');

  router.push(`/despesas?photos=${photosParam}&missao_id=${missaoIdParam}&missao_name=${missaoNameParam}`);
};
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef} // Passar a referência para a câmera
      />

      <View style={styles.photosContainer}>
        {photos.map((photoUri, index) => (
          <Image key={index} source={{ uri: photoUri }} style={styles.photoThumbnail} />
        ))}
      </View>

      <View style={styles.footer}>
        {/* Botão para alternar a câmera */}
        <TouchableOpacity style={styles.footerButton} onPress={toggleCameraFacing}>
          <Text style={styles.footerText}>Trocar Camera</Text>
        </TouchableOpacity>

        {/* Botão para tirar a foto */}
        <TouchableOpacity style={styles.footerButton} onPress={takePhoto}>
          <Text style={styles.footerText}>Tirar</Text>
        </TouchableOpacity>

        {/* Botão para voltar para o formulário */}
        <TouchableOpacity style={styles.footerButton} onPress={goBackWithPhotos}>
          <Text style={styles.footerText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 20,
  },
  photoThumbnail: {
    width: 30,
    height: 30,
    margin: 5,
    borderRadius: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 83,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  footerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 9,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

