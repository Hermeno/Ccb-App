import { Stack, useRouter } from 'expo-router';
import { StatusBar, Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function RootLayout() {
    
        const router = useRouter();
    const back = () => {
        router.back();
    }
    return (
        <>
            {/* StatusBar para todas as telas */}
            <StatusBar 
                barStyle="dark-content" 
                backgroundColor="#487d76" 
                translucent={false}
            />
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
                    }}
                />
                <Stack.Screen
                    name="home"
                    options={{
                        headerTitle: "INICIO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#121212',
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
                    name="mission"
                    options={{
                        headerTitle: "MISSÃO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    {/* <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" />
                                    </TouchableOpacity>                                     */}
                                    <Text style={styles.text}>MISSÃO</Text>
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
                    }}
                />
                <Stack.Screen
                    name="outras_moedas"
                    options={{
                        headerTitle: "MOEDAS",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>MOEDAS</Text>
                                </View>
                            ),

                    }}
                />
                <Stack.Screen
                    name="credito"
                    options={{
                        headerTitle: "CRÉDITO",
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>CRÉDITO</Text>
                                </View>
                            ),

                    }}
                />
                <Stack.Screen
                    name="cambio"
                    options={{
                        headerTitle: "CAMBIO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>CAMBIO</Text>
                                </View>
                            ),

                    }}
                />
                <Stack.Screen
                    name="cambios"
                    options={{
                        headerTitle: "CAMBIO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>CAMBIO</Text>
                                </View>
                            ),

                    }}
                />

                <Stack.Screen
                    name="missao"
                    options={{
                        headerTitle: "MISSÃO",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>MISSOES</Text>
                                </View>
                            ),

                    }}
                />
                <Stack.Screen
                    name="despesa"
                    options={{
                        headerTitle: "DESPESAS",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>DESPESAS</Text>
                                </View>
                            ),

                    }}
                />
                <Stack.Screen
                    name="despesas"
                    options={{
                        headerTitle: "CADASTRO DE DESPESAS",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>DESPESAS</Text>
                                </View>
                            ),

                    }}
                />
                <Stack.Screen
                    name="updatemissao"
                    options={{
                        headerTitle: "Update",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>DESPESAS</Text>
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
                        headerTintColor: '#121212',
                            header: () => (
                                <View style={styles.navbar}>
                                    <TouchableOpacity onPress={back} style={{marginLeft:10}}>
                                    <MaterialIcons name="arrow-back-ios" size={20} color="blue" style={styles.icon} />
                                    </TouchableOpacity>                                    
                                    <Text style={styles.text}>DESPESAS</Text>
                                </View>
                            ),

                    }}
                />

                <Stack.Screen
                    name="csv"
                    options={{
                        headerTitle: "csv",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                    }}
                />
                <Stack.Screen
                    name="camera"
                    options={{
                        headerTitle: "CAMERA",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                    }}
                />
                <Stack.Screen
                    name="cameradespesas"
                    options={{
                        headerTitle: "CAMERA",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                    }}
                />                
                <Stack.Screen
                    name="image"
                    options={{
                        headerTitle: "download",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                    }}
                />                
                <Stack.Screen
                    name="imagecambio"
                    options={{
                        headerTitle: "download",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                    }}
                />                

                <Stack.Screen
                    name="ForgetPasswordScreen"
                    options={{
                        headerTitle: "ForgetPasswordScreen",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
                    }}
                />
                <Stack.Screen
                    name="ResetPasswordScreen"
                    options={{
                        headerTitle: "ResetPasswordScreen",
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerStyle: { backgroundColor: '#487d76' },
                        headerTintColor: '#FFF',
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