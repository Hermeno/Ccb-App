import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getUserById, updateUserById } from '../services/user';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comum, setComum] = useState('');
  const [cargo, setCargo] = useState('');
  const [celular, setCelular] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();


useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        console.log('Sem token ou userId no AsyncStorage');
        return;
      }

      console.log('token:', token, 'userId:', userId); // debug

      const userData = await getUserById(userId, token); // converter
      console.log('userData:', userData); // debug

      setUser(userData);
      setName(userData.name || '');
      setEmail(userData.email || '');
      setComum(userData.comum || '');
      setCargo(userData.cargo || '');
      setCelular(userData.celular || '');
    } catch (error) {
      console.error('Erro ao buscar usuário:', error.response?.data || error.message);
    }
  };

  fetchUser();
}, []);


  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      if (token) {
        await updateUserById(
          userId,
          { name, email, comum, cargo, celular },
          token
        );

        Alert.alert('Sucesso', 'Usuário atualizado');
        setModalVisible(false);

        // Atualiza os dados locais
        setUser({ ...user, name, email, comum, cargo, celular });
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      Alert.alert('Erro', 'Falha ao atualizar usuário');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Comum:</Text>
        <Text style={styles.value}>{user.comum}</Text>

        <Text style={styles.label}>Cargo:</Text>
        <Text style={styles.value}>{user.cargo}</Text>

        <Text style={styles.label}>Celular:</Text>
        <Text style={styles.value}>{user.celular}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <Text style={styles.inputLabel}>Nome:</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Comum:</Text>
            <TextInput style={styles.input} value={comum} onChangeText={setComum} />

            <Text style={styles.inputLabel}>Cargo:</Text>
            <TextInput style={styles.input} value={cargo} onChangeText={setCargo} />

            <Text style={styles.inputLabel}>Celular:</Text>
            <TextInput
              style={styles.input}
              value={celular}
              onChangeText={setCelular}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#007bff' }]}
                onPress={handleUpdate}
              >
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: 'red' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
