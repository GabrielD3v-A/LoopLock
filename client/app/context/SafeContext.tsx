import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface SafeState {
    token: string | null;
    authenticated: boolean | null;
    simetric_key: string | null;
}

interface safeProps {
    safeState: SafeState;
    loading: boolean;
    onListSafe: () => Promise<any>;
    onCreateSafe: (name: string, username: string, password: string, domain: string) => Promise<any>;
    onEditSafe: () => void;
    onDeleteSafe: () => void;
}

const safeContext = createContext<safeProps | undefined>(undefined);

export const useSafe = () => {
    const context = useContext(safeContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
let token_key: string | null = 'token';
let symetric_key: string | null = 'simetric_key';
let API_URL = 'https://looplock.onrender.com/credential';
export const SafeProvider = ({children}: {children: ReactNode}) => {

    const [safeState, setSafeState] = useState<SafeState>({
        token: null,
        authenticated: null,
        simetric_key: null,
    });

    const [loading, setLoading] = useState<boolean>(true);



    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        try {
            const token = await SecureStore.getItemAsync(token_key);
            const simetric = await SecureStore.getItemAsync(symetric_key);
            if (token && simetric) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setSafeState({ token: token, authenticated: true, simetric_key: simetric });
            } else {
                setSafeState({ token: null, authenticated: false, simetric_key: null });
            }
        } catch (err) {
            setSafeState({ token: null, authenticated: false, simetric_key: null });
        } finally {
            setLoading(false); // Finaliza o loading em qualquer caso
        }
    };

    const listSafe = async () => {
        try {
            const result = await axios.post(`${API_URL}/list`, {
                "symetric_key": safeState.simetric_key,
                "jwt": safeState.token
            });

            if (result.data?.error) {
                return { error: true, message: result.data.msg.error };
            }else{
                return result;
            }
        } catch (err: any) {
            return { error: true, message: err?.response?.data?.message || 'Erro ao listar cofre' };
        }finally{
            setLoading(false);
        }
    };
    const createSafe = async (name: string, username: string, password: string, domain: string) => {
        try {
            const result = await axios.post(`${API_URL}/create`, {
                "name": name,
                "username": username,
                "password": password,
                "domain": domain,
                "symetric_key": safeState.simetric_key,
                "jwt": safeState.token

            });

            if (result.data?.error) {
                return { error: true, message: result.data.msg.error };
            } else {
                return result;
            }
        } catch (error: any) {
            return { error: true, message: error?.response?.data?.message || 'Erro na requisição' };
        }
    };
    const editSafe = () => {};
    const deleteSafe = () => {};

    return (
        <safeContext.Provider value={{safeState, loading, onListSafe: listSafe, onCreateSafe: createSafe, onEditSafe: editSafe, onDeleteSafe: deleteSafe}}>
            {children}
        </safeContext.Provider>
    ) 

}

export default SafeProvider