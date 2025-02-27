import { Stack } from 'expo-router';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import "../global.css";

export default function RootLayout() 
{
    return (
        // <NavigationContainer>
        <Stack>
            <StatusBar  backgroundColor="#111111" barStyle="light-content"/>
            <Stack.Screen name="index"  
            options={{
                headerShown:false,
            }}
            />
            <Stack.Screen name="Login" 
            options={{
                headerTitle: "Login",
                headerTitleStyle: {fontWeight: 'bold',},
                headerStyle: {    backgroundColor: '#f4511e',},
                headerTintColor: '#fff',
            }} />
            <Stack.Screen name="signUp" 
            options={{
                headerTitle: "Login",
                headerTitleStyle: {fontWeight: 'bold',},
                headerStyle: {backgroundColor: '#fff', borderBottomColor: '#00835f', borderBottomWidth: 1,},
                headerTintColor: '#121212',
            }}
            />
        </Stack>
        // </NavigationContainer>
    );
}               