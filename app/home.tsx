import React,  { } from 'react';
import { View, Text, } from 'react-native';
import { Link, Router  } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App ()
{
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to My App!</Text>
            <Link href="/" style={{ marginTop: 10 }}>
                <Text>Go to Home</Text>
            </Link>
        </View>
    );
}