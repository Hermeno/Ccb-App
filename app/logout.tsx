
import { Link,  } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const handleLogout = async () => {
    const navigation = useNavigation();
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    // Redirecionar para a tela de login
    navigation.navigate('Login');
};
