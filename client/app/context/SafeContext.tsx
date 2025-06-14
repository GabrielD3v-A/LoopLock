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
    onCreateSafe: () => void;
    onEditSafe: () => void;
    onDeleteSafe: () => void;
}

const safeContext = createContext<safeProps | undefined>(undefined);

export const safe = () => {
    const context = useContext(safeContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
let token_key: string | null = 'token';
let simetric_key: string | null = 'simetric_key';

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
                    setSafeState({ token: token_key, authenticated: true, simetric_key });
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

    const listSafe = () => {};
    const createSafe = () => {};
    const editSafe = () => {};
    const deleteSafe = () => {};

    return (
        <safeContext.Provider value={{safeState, loading, onListSafe: listSafe, onCreateSafe: createSafe, onEditSafe: editSafe, onDeleteSafe: deleteSafe}}>
            {children}
        </safeContext.Provider>
    ) 

}

export default SafeProvider