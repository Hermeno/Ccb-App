import React from 'react';
import { View, Text,  StyleSheet,TextInput } from 'react-native';
import { Link } from 'expo-router';



export default function SignUp () 
{
    return(
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>Cadastro</Text>
            <View style={styles.CardLogin}>                
                <Text style={styles.TextInput}>Usuario</Text>
                <TextInput style={styles.input} placeholder='nome do usuario'/>
                <Text style={styles.TextInput}>Nome completo</Text>
                <TextInput style={styles.input} placeholder='seu nome completo'/>

                <Text style={styles.TextInput}>Email</Text>
                <TextInput style={styles.input} placeholder='email'/>

                <Text style={styles.TextInput}>Password</Text>
                <TextInput style={styles.input} secureTextEntry={true} placeholder='******'/>

                <View style={styles.BotaoLogin}>
                    <Text style={styles.TextBotao}>Login</Text>
                </View>

                <View style={styles.containerLines}>
                    <View style={styles.line} />
                    <Text style={styles.text}>Or</Text>
                    <View style={styles.line} />
                </View>

                {/* <Text style={styles.TextNaoPossuiConta}>Nao possui uma conta <Link href="/Login">Sign-Up</Link></Text> */}
                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>
                        Ja possui uma conta ? 
                        <Text  style={{color:"#00835f", fontSize:17}}><Link href="/"> Entre </Link></Text>
                    </Text>
                </View>
                {/* <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>Esqueceu a senha? <Link href="/Login">Recuperar</Link></Text>
                </View> */}




            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    TextHeaderLogin:{
        fontSize: 30,
        fontWeight: "bold",
        color: "#121212",
        // marginTop: -130,
    },
    CardLogin:{
        width: 330,
        // height: 400,
        // backgroundColor: "#121212",
        // borderRadius: 30,
        // padding: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop:150
    },
    input:{
        marginBottom: 10,
        // padding: 10,
        borderBottomWidth: 2,
        borderColor: "#ccc",
        width: "100%",
        // color:"#24991d"cc
    },
    TextInput:{
        marginBottom: 10,
        borderColor: "#121212",
        width: "100%",
        fontSize: 16,
                color:"#121212",
                fontWeight: "bold",
    },


    BotaoLogin:{
        width: "100%",
        height: 50,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
    },
    TextNaoPossuiConta:{
        marginTop: 20,
        color: "#121212",
        fontSize: 18,
        fontWeight: "500",

    },
    TextRecuperarSenha:{
        color: "#121212",
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
        color: "#24991d"      
    },
    TextBotao:{
        color: "#fff",
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



})