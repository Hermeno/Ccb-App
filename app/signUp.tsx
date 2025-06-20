import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { cadastrarUsuario } from '../services/user'; 
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';  // Importa os ícones

export default function SignUp() {
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

const handleSignUp = async () => {
    try {
        const response = await cadastrarUsuario({
            user,
            name,
            email,
            password
        });
        if (response.status === 201) {
            Alert.alert('Cadastro realizado com sucesso!');
            router.replace('/');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.error || 'Erro ao cadastrar usuário';
            Alert.alert('Ops!', msg);
        } else {
            Alert.alert('Erro inesperado ao se comunicar com o servidor');
        }
    }
};


  return (
    <View style={styles.mainContainer}>
      <View  style={styles.containerForm}>
      <Text style={styles.textWelcome}>Welcome back</Text>



                    <TextInput 
                        value={name} 
                        onChangeText={setName} 
                        style={styles.input} 
                        placeholder="Seu nome completo"
                    />
                   <TextInput 
                        value={email} 
                        onChangeText={setEmail} 
                        style={styles.input} 
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput 
                        value={password} 
                        onChangeText={setPassword} 
                        style={styles.input} 
                        secureTextEntry 
                        placeholder="******"
                    />


          <View  style={styles.textsFlexs}>
            <Text style={styles.rememberText}>
              Remember me
            </Text>
            <Text style={styles.rememberText}>             
              <Text style={{ color: "#00835f",}}><Link href="/ForgetPasswordScreen"> Esqueceu senha ? </Link></Text>
            </Text>
          </View>


          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>




          <Text style={styles.textAllsignUp}>
            Don't have an account?
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.signUpLink}> Logar </Text>
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