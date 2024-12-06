import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';
import Logo from '@/components/logo';
import InputComponent from '@/components/Input';
import ButtonComponent from '@/components/button';
import CheckboxComponent from '@/components/checkbox';
import Recaptcha from '@/components/recaptcha';

export default function Login() {

  const handleRecaptchaVerify = (token: any) => {
    Alert.alert('Token recebido', token); // Apenas para teste, exiba o token
    // Envie o token ao seu backend
    fetch('http://192.168.1.3:5000/login/validate-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Sucesso', 'reCAPTCHA validado com sucesso!');
        } else {
          Alert.alert('Erro', 'Falha na validação do reCAPTCHA.');
        }
      })
      .catch((error) => {
        Alert.alert('Erro', 'Erro ao validar o reCAPTCHA.');
      });
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleUsernameChange = (value: string) => {
    setUsername(value); // Atualiza apenas o username
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value); // Atualiza apenas o password
  };


  const handleCheckboxChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  const handleButtonClick = () => {
    const params = {
      username: username,
      password: password,
      rememberMe: rememberMe
    };
    console.log('Button clicked with params:', params);
    // Aqui você pode fazer uma chamada à API
  };

  
  return (
    <View className="flex-1  items-center  bg-lp-blue w-full">
      <View className='w-full bg-lp-blue h-1/4 flex flex-col items-center'>
          <Link href="/" className='h-24 mb-5' ><Logo></Logo></Link>
           
          <Text className='font-montserrat  text-white text-center text-xl'>
              Inicie uma sessão ou crie sua conta {'\n'}para acessar seu cofre protegido
          </Text>
      </View>
      <View className='w-full bg-white h-3/4 rounded-t-3xl px-10'>
        <Text className='font-fellix-regular text-lp-blue text-center text-5xl my-10'>Faça login</Text>

        <View className='w-full flex flex-col items-center gap-y-6'>
          <InputComponent textPlaceholder='E-mail' icon={false} password={false} onChange={handleUsernameChange}></InputComponent>
          <InputComponent textPlaceholder='Senha' icon={true} password={true} onChange={handlePasswordChange}></InputComponent>
        </View>
        <Text className='font-montserrat text-xs text-lp-blue w-full text-start my-3'>Esqueci minha senha</Text>

        <View className='w-full  flex flex-row justify-between '>
          <View className='w-1/2 flex flex-row items-center gap-2'>
            <CheckboxComponent checked={rememberMe} onChange={handleCheckboxChange}  ></CheckboxComponent>
            <Text className='font-montserrat text-sm text-lp-blue'>Lembrar minha senha ?</Text>
          </View>
          <View className='w-[45%] h-20 flex justify-center'>
            <Recaptcha onVerify={handleRecaptchaVerify} />
          </View>
        </View>
          
        
        <View className='my-8'>
          <ButtonComponent text='Confirmar'  actionKey='login' params={{ username, password, rememberMe }}></ButtonComponent>
        </View>

        <Text className='font-montserrat text-xs text-lp-blue w-full'>Ainda não tem uma conta? <Link href="/register" className='font-montserrat text-xs text-lp-lightblue'>Criar Conta</Link></Text>
        
        <View className='w-full absolute bottom-1  left-10'>
          <Text className='text-center font-montserrat text-xs text-gray-400'>@Copyright 2023</Text> 
        </View>
        
      </View>
      
    </View>
  )
}