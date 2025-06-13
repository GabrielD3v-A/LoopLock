import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
}

interface AuthProps {
  authState: AuthState;
  loading: boolean;
  onRegister: (name: string, email: string, master_password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => void;
}

const token_key = 'token';
export const API_URL = 'https://looplock.onrender.com/auth';

const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(token_key);
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setAuthState({ token, authenticated: true });
        } else {
          setAuthState({ token: null, authenticated: false });
        }
      } catch (err) {
        setAuthState({ token: null, authenticated: false });
      } finally {
        setLoading(false); // Finaliza o loading em qualquer caso
      }
    };
    checkToken();
  }, []);

  const register = async (name: string, email: string, master_password: string) => {
    try {
      const result = await axios.post(`${API_URL}/register`, {
        name,
        email,
        master_password,
      });
      if (result.data?.error) {
        alert(result.data.msg);
        return { error: true, message: result.data.msg };
      } else {
        return await login(email, master_password);
      }
    } catch (error: any) {
      return { error: true, message: error?.response?.data?.message || 'Erro no registro' };
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
    } catch (error: any) {
      return { error: true, message: error?.response?.data?.message || 'Erro no login' };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(token_key);
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({ token: null, authenticated: false });
  };

  return (
    <AuthContext.Provider value={{ authState, loading, onRegister: register, onLogin: login, onLogout: logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;