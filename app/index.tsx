import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,StatusBar } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/user'; 
import { jwtDecode } from "jwt-decode";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function Home() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    type MyTokenPayload = {
        id: string,
        iat: number,
        exp: number,
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Preencha todos os campos');
            return;  
        }
        try {
           const token = await loginUsuario({ email, password });
            if (token) {
                await AsyncStorage.setItem('userToken', token);
                const decodedToken = jwtDecode<MyTokenPayload>(token);
                const id = await AsyncStorage.setItem('userId', decodedToken.id);  
                Alert.alert("Logado com sucesso");
                router.replace('/mission'); 
            } else {
                router.replace('/');
            }
        } catch (error) {
            Alert.alert('Credenciais inválidas ou erro ao fazer login');
            throw error;
        }
    };


















  return (

    <View style={styles.mainContainer}>
    
      <View  style={styles.container}>
          {/* <Text style={styles.logoText}>Luxe</Text> */}
      </View>
      <View  style={styles.containerForm}>
      <Text style={styles.textWelcome}>Welcome back</Text>


          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="sentences" // ou "words" para cada palavra
            // keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />



          <View  style={styles.textsFlexs}>
            <Text style={styles.rememberText}>
              Remember me
            </Text>
            <Text style={styles.rememberText}>
              Esqueceu senha ?
            </Text>
          </View>


          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>




          <Text style={styles.textAllsignUp}>
            Don't have an account?
            <TouchableOpacity onPress={() => router.push('/signUp')}>
              <Text style={styles.signUpLink}> Crie uma conta </Text>
            </TouchableOpacity>
          </Text>





      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column', // padrão, mas deixamos explícito
  },
  container: {
    // flex: ,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: "20%"
  },
  containerForm: {
    flex: 2,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    width: "100%",
  },
  input: {
    width: "75%",
    padding: 12,
    marginVertical: 10,
    // borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    borderWidth:1,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 100,
    padding: 15,
    backgroundColor: "#00835f",
    // backgroundColor: "#007bff",
    borderRadius: 15,
    width: "75%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  logoText:{
    fontSize: 80,
    fontWeight: "bold",
    color: "#00835f",
    // marginBottom: -90,
  },
  textWelcome:{
    marginTop: 50,
    fontSize: 20,
    fontWeight: "bold",
    color: "#00835f",
    marginBottom: 30,
    // alignSelf: "flex-start",
    // width: "75%",
  },
  signUpLink:{
    fontSize: 15,
    // fontWeight: "bold",
    color: "#00835f",
    textAlign: "center",
    marginTop:10,
  },
  textsFlexs:{
    // flex: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 30,
    // backgroundColor: "#00835f",
    width: "75%"
  },
  rememberText:{
    color: "#00835f",
    fontSize: 15,
    fontWeight: "bold",
    // marginLeft: 10,
  },
  textAllsignUp:{
    fontWeight: "bold",
    marginTop: 10,
  }
});

// export default Home;
