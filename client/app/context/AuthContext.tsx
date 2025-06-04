import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface AuthProps{
    authState?: { token:string | null, authenticated: boolean| null };
    onRegister?: (name: string, email: string, master_password: string) => void;
    onLogin?: (email: string, password: string) => void;
    onLogout?: () => void;
}

const token_key = 'token';
export const API_URL = 'https://looplock.onrender.com';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState({ token: null, authenticated: null });

    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync(token_key);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({ token, authenticated: true });
            } else {
                setAuthState({ token: null, authenticated: false });
            }
            setLoading(false);
        };
        checkToken();
    }, []);

    // Define the handler functions
    const onRegister = async (name: string, email: string, master_password: string) => {
        // Implement registration logic here
    };

    const onLogin = async (email: string, password: string) => {
        // Implement login logic here
    };

    const onLogout = async () => {
        // Implement logout logic here
    };

    return (
        <AuthContext.Provider value={{ authState, onRegister, onLogin, onLogout }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};