import React from 'react';
import { View, Text,  StyleSheet,TextInput } from 'react-native';
import { Link } from 'expo-router';



export default function Home () 
{
    return(
        <View style={styles.container}>
            <Text style={styles.TextHeaderLogin}>Login</Text>
            <View style={styles.CardLogin}>                
                <Text style={styles.TextInput}>Username</Text>
                <TextInput style={styles.input} placeholder='Nome do usuario' />
                
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

                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>
                        Nao possui uma conta ? 
                        <Text  style={{color:"#00835f", fontSize:17}}><Link href="/signUp"> Sign-Up</Link></Text>
                    </Text>
                </View>
                <View style={styles.TextRecuperarSenha}>
                    <Text style={{color:"#24h91d", fontWeight:'bold'}}>Esqueceu a senha? 
                    <Text  style={{color:"#00835f", fontSize:17}}><Link href="/Login"> Recuperar </Link></Text>
                    </Text>
                </View>



            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    TextHeaderLogin:{
        fontSize: 30,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 30,
    },
    CardLogin:{
        width: 330,
        // height: 400,
        // backgroundColor: "#ffffff",
        borderRadius: 30,
        // padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    input:{
        marginBottom: 10,
        // padding: 10,
        borderBottomWidth: 2,
        borderColor: "#ccc",
        width: "100%",
        color:"#121212"
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
        height: 40,
        backgroundColor: "#00835f",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
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
})