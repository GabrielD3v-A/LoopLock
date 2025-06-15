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
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<any>;
  onLogout: () => void;
  onGetPassword: () => void;
  onResetPassword: () => void;
  onGetUser: () => Promise<any>;
}

const token_key = 'token';
const symetric_key = 'simetric_key';
const password_key = 'password';
export const API_URL = 'https://looplock.onrender.com/auth';
export const USER_URL = 'https://looplock.onrender.com/user';

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

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/register`, {
        "username": name,
        "email": email,
        "password": password,
      });
      if (result.data?.error) {
        alert(result.data.msg);
        return { error: true, message: result.data.msg };
      } else {
        return await login(email, password, false);
      }
    } catch (error: any) {
      return { error: true, message: error?.response?.data?.message || 'Erro no registro' };
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.access_token;
      const symetric = response.data.symetric_key;
      
      if(rememberMe){
        await SecureStore.setItemAsync(password_key, password);
      }
      if (token && symetric) {
        await SecureStore.setItemAsync(token_key, token);
        await SecureStore.setItemAsync(symetric_key, symetric);
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

  const getpassword = async () => {
    const password = await SecureStore.getItemAsync(password_key);
    return password;
  }

  const resetPassword = async () => {
    const response = await SecureStore.deleteItemAsync(password_key);
  }

  const getUserAuth = async () => {
    try {
      const response = await axios.post(`${USER_URL}/get-user-data`,{
        "jwt": authState.token
      });
  
      if(response.data?.error){
        alert(response.data.msg);
        return { error: true, message: response.data.msg};
      }else{
        return response;
      }
    
    } catch (err: any) {
      return { error: true, message: err?.response?.data?.message || 'Erro na requisição' };
    }
  }


  return (
    <AuthContext.Provider value={{ 
      authState, 
      loading, 
      onRegister: register, 
      onLogin: login, 
      onLogout: logout, 
      onGetPassword: getpassword,
      onResetPassword: resetPassword,
      onGetUser: getUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;