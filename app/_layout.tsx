import { Stack } from 'expo-router';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';



export default function RootLayout() 
{
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Login"
                options={{
                    headerTitle: "Login",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerStyle: { backgroundColor: '#f4511e' },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="signUp"
                options={{
                    headerTitle: "Cadastro",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#121212',
                }}
            />
            <Stack.Screen
                name="home"
                options={{
                    headerTitle: "inicio",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#121212',
                }}
            />
            <Stack.Screen
                name="lost_password"
                options={{
                    headerTitle: "Voltar",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerStyle: { backgroundColor: '#487d76' },
                    headerTintColor: '#fff',
                }}
            />

            {/* <Stack.Screen
                name="rest_login"
                options={{
                    headerShown: false,
                }}
            /> */}
            <Stack.Screen
                name="outras_moedas"
                options={{
                    headerTitle: "Outras Moedas",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#121212',
                }}
            />
            <Stack.Screen
                name="credito"
                options={{
                    headerTitle: "Credito",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#121212',
                }}
            />
            <Stack.Screen
                name="cambio"
                options={{
                    headerTitle: "Cambio",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#121212',
                }}
            />            

        </Stack>
    );
}               