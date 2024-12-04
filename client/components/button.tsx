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
        login: (params) => {
            if (!params) {
                console.log('Nenhum parâmetro enviado.');
                return;
            }
            
            
            let jsonObject = JSON.parse(params);
            console.log(jsonObject);
            
            
            fetch('http://192.168.1.3:5000/login', {
              method: 'POST',
              body: JSON.stringify({
                username: jsonObject.username,
                password: jsonObject.password
              }),
              headers: {
                'Content-Type': 'application/json', // Corrigido aqui
                'X-Custom-Header': 'value',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Accept': '*'
              }           
            }).then((response) => {
              console.log('Enviando dados ao backend:', params);
              return response.json(); // Corrigido aqui
            })
            .then((data) => {
              console.log('Resposta do backend:', data);
              if(data.id == 100){
                router.push('/');
              }else{
                console.log('Login falhou');
              }
            })
            .catch((error) => {
              console.log('Erro:', error);
              console.log('Login falhou');
            });
            
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
