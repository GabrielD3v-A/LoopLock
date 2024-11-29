import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonComponentProps {
  text: string; // Texto exibido no botão
  actionKey: string; // Identifica a ação
  params?: any; // Parâmetros opcionais para a ação
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ text, actionKey, params }) => {
  
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
        changePage: () =>{
            if(!params){
                console.log('Nenhum parâmetro enviado.');
                return;
            }   
            router.push(params);
        },
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
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>{text}</Text>
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
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'montserrat'
  },
});

export default ButtonComponent;
