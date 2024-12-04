import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React from 'react'
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
    fetch('https://seu-backend-url.com/validate-recaptcha', {
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

  
  return (
    <View className="flex-1  items-center bg-lp-blue w-full">
      <View className='w-full bg-lp-blue h-1/4 flex flex-col items-center'>
          <Link href="/" className='h-24 mb-5' ><Logo></Logo></Link>
           
          <Text className='font-montserrat  text-white text-center text-xl'>
              Inicie uma sessão ou crie sua conta {'\n'}para acessar seu cofre protegido
          </Text>
      </View>
      <View className='w-full bg-white h-3/4 rounded-t-3xl px-10'>
        <Text className='font-fellix-regular text-lp-blue text-center text-5xl my-10'>Faça login</Text>

        <View className='w-full flex flex-col items-center gap-y-6'>
          <InputComponent textPlaceholder='E-mail' icon={false} password={false}></InputComponent>
          <InputComponent textPlaceholder='Senha' icon={true} password={true}></InputComponent>

          <View className='w-full flex flex-row justify-between mb-10'>
            <View className='flex flex-row items-center gap-2'>
              <CheckboxComponent></CheckboxComponent>
              <Text className='font-montserrat text-sm text-lp-blue'>Lembrar minha senha ?</Text>
            </View>
            <View>
              <Recaptcha onVerify={handleRecaptchaVerify} />
            </View>
          </View>
        </View>

        <ButtonComponent text='Confirmar'  actionKey='login' params= '{"username": "test", "password": "1234"}'></ButtonComponent>

      </View>
    </View>
  )
}