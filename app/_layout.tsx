import { Stack, useRouter } from 'expo-router';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
    
        const router = useRouter();
    const back = () => {
        router.back();
    }
    return (
            <>
            <StatusBar style="light" backgroundColor="#487d76" translucent={false} />
         
            
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="signUp"
                    options={{
                        headerTitle: "CADASTRO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />
                <Stack.Screen
                    name="mission"
                    options={{
                        headerTitle: "MISSÃO",
                        // headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />  
                <Stack.Screen
                    name="home"
                    options={{
                        headerTitle: "INICIO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                            header: () => (
                                <View style={styles.navbar}>
                                    {/* <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" />
                                    </TouchableOpacity>                                     */}
                                    <Text style={styles.text}>INICIO</Text>
                                </View>
                            ),

                    }}
                />
              
                <Stack.Screen
                    name="lost_password"
                    options={{
                        headerTitle: "ESQUECEU-SENHA",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />
                <Stack.Screen
                    name="outras_moedas"
                    options={{
                        headerTitle: "MOEDAS",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false, 

                    }}
                />
                <Stack.Screen
                    name="credito"
                    options={{
                        headerTitle: "CRÉDITO",
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false, 

                    }}
                />
                {/* stack user */}
                <Stack.Screen
                    name="user"
                    options={{
                        headerTitle: "PERFIL",
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false,
                    }}
                />

                <Stack.Screen
                    name="updatecambio"
                    options={{
                        headerTitle: "Atualizar Câmbio",
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false, 

                    }}
                />
                <Stack.Screen
                    name="cambio"
                    options={{
                        headerTitle: "CAMBIO",
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false, 
                    }}
                />
                <Stack.Screen
                    name="visualizar_cambios"
                    options={{
                        headerTitle: "CAMBIO",
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false, 
                    }}
                />

                <Stack.Screen
                    name="missao"
                    options={{
                        headerTitle: "MISSÃO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false, 

                    }}
                />
                <Stack.Screen
                    name="visualizar_despesa"
                    options={{
                        headerTitle: "DESPESAS",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false,

                    }}
                />
                <Stack.Screen
                    name="despesas"
                    options={{
                        headerTitle: "CADASTRO DE DESPESAS",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false,

                    }}
                />
                <Stack.Screen
                    name="document"
                    options={{
                        headerTitle: "document",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false,

                    }}
                />
                <Stack.Screen
                    name="pdf"
                    options={{
                        headerTitle: "pdf",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false,

                    }}
                />
                <Stack.Screen
                    name="updatemissao"
                    options={{
                        headerTitle: "Update",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerShadowVisible: false, 
                        headerTintColor: '#fff',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>ARUALIZAR MISSÃO</Text>
                                </View>
                            ),

                    }}
                />

                <Stack.Screen
                    name="updatedespesa"
                    options={{
                        headerTitle: "Update",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#fff',
                        headerShadowVisible: false, 
                            // header: () => (
                            //     <View style={styles.navbar}>
                            //         <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                            //         <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                            //         </TouchableOpacity>                                    
                            //         <Text style={styles.text}>DESPESAS</Text>
                            //     </View>
                            // ),

                    }}
                />

                <Stack.Screen
                    name="csv"
                    options={{
                        headerTitle: "csv",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />
                <Stack.Screen
                    name="camera"
                    options={{
                        headerTitle: "CAMERA",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />
                <Stack.Screen
                    name="cameradespesas"
                    options={{
                        headerTitle: "CAMERA",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />                
                <Stack.Screen
                    name="image"
                    options={{
                        headerTitle: "download",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />                
                <Stack.Screen
                    name="imagecambio"
                    options={{
                        headerTitle: "download",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />                

                <Stack.Screen
                    name="ForgetPasswordScreen"
                    options={{
                        headerTitle: "ForgetPasswordScreen",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />
                <Stack.Screen
                    name="ResetPasswordScreen"
                    options={{
                        headerTitle: "ResetPasswordScreen",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                        headerShadowVisible: false, 
                    }}
                />
            </Stack>
        </>
    );
    // ForgetPasswordScreen
    // ResetPasswordScreen
}


const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#487d76',
        height: 60,
        paddingTop: Platform.OS === 'android'? 20 : 0,
        alignItems: 'center',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 30,
    },

    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    icon: {
        // marginLeft: 10,
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    }
})