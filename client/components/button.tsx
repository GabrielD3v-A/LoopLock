import register from '@/app/(screens)/public/register';
import { useAuth } from '@/app/context/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

interface ButtonComponentProps {
  text: string; // Texto exibido no botão
  actionKey: string; // Identifica a ação
  params?: any; // Parâmetros opcionais para a ação
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ text, actionKey, params }) => {
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const { onLogin } = useAuth();
  const { onRegister } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  

    const actions: Record<string, (params?: any) => void> = {
        mostrarOutroExemplo: (params) => {
            if(!params){
                console.log('Nenhum parâmetro enviado.');
                return;
            } 
            console.log('Mensagem:', params || 'Nenhuma mensagem passada.');

        },
        sendData: (params) => {
            if (!params) {
                console.log('Nenhum parâmetro enviado.');
                return;
            }
            console.log('Enviando dados ao backend:', params);
        },
        showMessage: (params) => {
            console.log('Mensagem:', params?.message || 'Nenhuma mensagem passada.');
        },
        changePage: (params) =>{
            if(!params){
                console.log('Nenhum parâmetro enviado.');
                return;
            }   
            router.push(params);
        },
        login: async (params) => {
          if (!params) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
          }
          const { username, password, rememberMe} = params;
          if (!username || !password) {
            Alert.alert('Erro', 'Usuário e senha são obrigatórios.');
            return;
          }

          if (!validateEmail(username)) {
            Alert.alert('Erro', 'O e-mail inserido é inválido.');
            return;
          }
          setIsLoading(true); // Inicia o estado de carregamento
    
    
          try {
            const result = await onLogin?.(username, password, rememberMe);
            // Only check result if it's not undefined/null and has the expected structure
            if (
              result.error
            ) {
              alert(result.message);
            }else{
              if(result.status == 200){
                router.push('/(tabs)/auth/safe');
              }
            }
          } catch (error) {
            console.error('Erro:', error);
            Alert.alert('Erro', 'Falha na conexão. Tente novamente.');
          } finally {
            setIsLoading(false); // Finaliza o estado de carregamento
          }
        },
        register: async (params) => {
          if (!params) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
          }

          const username: string = params.username;
          const email: string = params.email;
          const passwordMaster: string = params.passwordMaster;
          const confirmPasswordMaster: string = params.confirmPasswordMaster;
          const passwordStrength: number = params.passwordStrength;
          const terms: boolean = params.terms;

          console.log(username)
          console.log(email)
          console.log(passwordMaster)
          if (!username || !passwordMaster || !email ) {
            Alert.alert('Erro', 'Preencha os campos corretamente');
            return;
          }

          if(username.length < 2){
            Alert.alert('Erro', 'O usuário deve ter pelo menos 2 caracteres.');
            return;
          }

          if(passwordMaster != confirmPasswordMaster){
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
          }

          if (!validateEmail(email)) {
            Alert.alert('Erro', 'O e-mail inserido é inválido.');
            return;
          }

          if(passwordMaster.length < 12 && confirmPasswordMaster.length < 12){
            Alert.alert('Erro', 'A senha deve ter pelo menos 12 caracteres.');
            return;
          }

          if (passwordStrength < 76) {
            Alert.alert('Erro', 'A senha é muito fraca. Tente novamente.');
            return;
          }
    
          if(!terms){
            Alert.alert('Erro', 'Aceite os termos de uso para continuar.');
            return;
          }
          setIsLoading(true);

          try {
            
            const result = await onRegister?.(username, email, passwordMaster);
            // Only check result if it's not undefined/null and has the expected structure
            if (
              result !== undefined &&
              result !== null &&
              typeof result === 'object' &&
              'data' in result &&
              (result as any).data?.error
            ) {
              alert((result as any).msg);
            }else{
              // router.push('/(tabs)/auth/safe');
              if(result.status == 200){
                router.push('/(tabs)/auth/safe');
              }
            }

          } catch (error) {
            console.error('Erro:', error);
            Alert.alert('Erro', 'Falha na conexão. Tente novamente.');
          } finally {
            setIsLoading(false); // Finaliza o estado de carregamento
          }
        }
    };

    const handlePress = () => {
        const action = actions[actionKey];
        if (action) {
            action(params); // Passa os parâmetros para a função
        } else {
            console.log(`Nenhuma função encontrada para a chave: ${actionKey}`);
        }
    };

  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#00B4D8',
    paddingVertical: 8,
    borderRadius: 50,
  },
  buttonDisabled: {
    backgroundColor: '#CBCCF5',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'montserrat'
  },
});

export default ButtonComponent;
