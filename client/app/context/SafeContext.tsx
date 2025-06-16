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
    onListSafe: () => void;
    onCreateSafe: (name: string, username: string, password: string, domain: string) => void;
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
let simetric_key: string | null = 'simetric_key';
let API_URL = 'https://looplock.onrender.com/credential';
export const SafeProvider = ({children}: {children: ReactNode}) => {

    const [safeState, setSafeState] = useState<SafeState>({
        token: null,
        authenticated: null,
        simetric_key: null,
    });

    const [loading, setLoading] = useState<boolean>(true);



    useEffect(() => {
        const checkToken = async () => {
            try {
                token_key = await SecureStore.getItemAsync('token_key');
                simetric_key = await SecureStore.getItemAsync('simetric_key');
                if (token_key && simetric_key) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token_key}`;
                    setSafeState({ token: token_key, authenticated: true, simetric_key: simetric_key });
                } else {
                    setSafeState({ token: null, authenticated: false, simetric_key: null });
                }
            } catch (err) {
                setSafeState({ token: null, authenticated: false, simetric_key: null });
            } finally {
                setLoading(false); // Finaliza o loading em qualquer caso
            }
        };
        checkToken();
    }, []);

    const listSafe = async () => {
        try {
            const result = await axios.get(`${API_URL}/list`);
            return { data: result.data };
        } catch (err: any) {
            return { error: true, message: err?.response?.data?.message || 'Erro ao listar cofre' };
        }
    };
    const createSafe = async (name: string, username: string, password: string, domain: string) => {
        try {
            const result = await axios.post(`${API_URL}/create`, {
                "name": name,
                "username": username,
                "password": password,
                "domain": domain,
                "simetric_key": safeState.simetric_key
            });

            if (result.data?.error) {
                alert(result.data.msg);
                return { error: true, message: result.data.msg };
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