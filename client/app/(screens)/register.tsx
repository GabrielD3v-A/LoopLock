import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import Logo from '@/components/logo';
import InputComponent from '@/components/Input';
import ButtonComponent from '@/components/button';
import CheckboxComponent from '@/components/checkbox';
import Recaptcha from '@/components/recaptcha';
export default function register() {
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
    
      return (
        <View className="flex-1  items-center  bg-lp-blue w-full">
          <View className='w-full bg-lp-blue h-1/4 flex flex-col items-center'>
              <Link href="/" className='h-24 mb-5' ><Logo></Logo></Link>
               
              <Text className='font-montserrat  text-white text-center text-xl'>
                Não possui uma conta ? {'\n'}
                Sem problemas. {'\n'}
                Crie uma e fique mais seguro.
              </Text>
          </View>
          <View className='w-full bg-white h-3/4 rounded-t-3xl px-10'>
            <Text className='font-fellix-regular text-lp-blue text-center text-5xl my-10'>Cadastre-se</Text>
    
            <View className='w-full flex flex-col items-center gap-y-4'>
                {/* <InputComponent textPlaceholder='Nome completo' icon={false} password={false}></InputComponent> */}
                {/* <InputComponent textPlaceholder='E-mail' icon={false} password={false}></InputComponent> */}
                {/* <InputComponent textPlaceholder='Senha mestra' icon={true} password={true}></InputComponent> */}
                {/* <Text className='font-montserrat text-xs text-lp-blue w-full text-start '>Sua senha mestra deve conter no mínimo 12 carecteres, além de ser composta por letras maiúsculas, minúsculas, números e símbolos.</Text> */}
    
              {/* <InputComponent textPlaceholder='Confirme sua senha mestra' icon={true} password={true}></InputComponent> */}
            </View>

            <View className='w-full  flex flex-row justify-between '>
              <View className='w-1/2 flex flex-row items-center gap-2'>
                <CheckboxComponent checked={false} onChange={function (value: boolean): void {
                  throw new Error('Function not implemented.');
                } }></CheckboxComponent>
                <Text className='font-montserrat text-sm text-lp-blue'>Eu li e aceitos os <Text className='underline'>termos</Text></Text>
              </View>
              <View className='w-[45%] h-20 flex justify-center'>
                <Recaptcha onVerify={handleRecaptchaVerify} />
              </View>
            </View>
              
            
            <View className='my-6'>
              <ButtonComponent text='Confirmar'  actionKey='login' params= '{"username": "test", "password": "1234"}'></ButtonComponent>
            </View>
    
            <Text className='font-montserrat text-xs text-lp-blue w-full'>
                Já possui uma conta?  
                <Link href="/login" className='font-montserrat text-xs text-lp-lightblue'> Faça Login</Link>
            </Text>
            
            <View className='w-full fixed bottom-[-3%]  left-0'>
              <Text className='text-center font-montserrat text-xs text-gray-400'>@Copyright 2023</Text> 
            </View>
            
          </View>
          
        </View>
      )
}

