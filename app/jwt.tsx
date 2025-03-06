import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

type MyTokenPayload = {
    id: string;
    name: string;
    username: string;
    email: string;
};

export const useJwt = () => {
    const [user, setUser] = useState<MyTokenPayload | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    // console.log(token);
                    const decoded: MyTokenPayload = jwtDecode(token);
                    setUser(decoded);

                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário', error);
            }
        };

        fetchUserData();
    }, []);

    return user;  // Agora o hook retorna o usuário decodificado
};



export default function JwtComponent() {
    return null;  // Isso faz o arquivo ter um `export default`, mas é gambiarra
}