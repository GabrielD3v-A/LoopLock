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
export const API_URL = 'https://looplock.onrender.com/auth';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{ 
        token: string | null, authenticated: boolean | null }>({ token: null, authenticated: null });

    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync(token_key);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({ token, authenticated: true });
            } else {
                setAuthState({ token: null, authenticated: false });
            }
        };
        checkToken();
    }, []);

    // Define the handler functions
    const register = async (name: string, email: string, master_password: string) => {
        try {
            const result =  await axios.post(`${API_URL}/register`, { name, email, master_password });
            if (result.data && result.data.error) {
                alert(result.data.msg);
            } else {
                // You need to pass email and master_password to login
                await login(email, master_password);
            }
        } catch (error: any | null) {
            return { error: true, message: (error?.response?.data.message) };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const token = response.data.access_token;
            if (token) {
                await SecureStore.setItemAsync(token_key, token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({ token, authenticated: true });
            }
            return response;
        } catch (error: any | null) {
            return { error: true, message: (error?.response?.data.message) };
        }
    };

    const logout = async () => {
        // Implement logout logic here
        await SecureStore.deleteItemAsync(token_key);
        axios.defaults.headers.common['Authorization'] = '';
        setAuthState({ token: null, authenticated: false });
    };


    const value = {
        authState,
        onRegister : register,
        onLogin: login,
        onLogout: logout,
    };

    return (
        <AuthContext.Provider value={ value }>
            children
        </AuthContext.Provider>
    );
};