import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router';

import Logo from '@/components/logo';
import InputComponent from '@/components/Input';
import ButtonComponent from '@/components/button';
import CheckboxComponent from '@/components/checkbox';
import Recaptcha from '@/components/recaptcha';
import { useAuth } from '@/app/context/AuthContext';



export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);

  const {onGetPassword} = useAuth();

  useEffect(() => {
  const fetchPassword = async () => {
    const storedPassword = await onGetPassword();
    console.log('Senha recuperada:', storedPassword);
    if (storedPassword != null) {
      setPassword(storedPassword);
      setRememberMe(true);
    }
  };

  fetchPassword();
}, []);


  const getUsernameChange = (value: string) => {
    setUsername(value); // Atualiza apenas o username
  };

  const getPasswordChange = (value: string) => {
    setPassword(value); // Atualiza apenas o password
  };


  const getCheckboxChange = (checked: boolean) => {
    setRememberMe(checked);
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
        <Text className=' text-lp-blue text-center text-5xl my-10' style={{ fontFamily: 'Fellix-Regular' }}>Faça login</Text>

        <View className='w-full flex flex-col items-center gap-y-6'>
          <InputComponent textPlaceholder='E-mail' icon={false} password={false} onChange={getUsernameChange} ></InputComponent>
          <InputComponent textPlaceholder='Senha' icon={true} password={true} onChange={getPasswordChange} value={password}></InputComponent>
        </View>

        <View className='w-full flex items-center'>
          {/* <TouchableOpacity className="w-full flex-row items-center justify-center bg-[#CBCCF5] py-2 rounded-full mt-3" onPress={loginWithGoogle} >   
            {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <><Text className="text-lp-blue text-base font-semibold">Sign in with  </Text><FontAwesome name="google" size={20} color="#03045E" className="mr-2" /></>
            )}
          </TouchableOpacity> */}
        </View>

        <Text className='font-montserrat text-xs text-lp-blue w-full text-start my-1 underline' style={{ fontFamily: 'Montserrat-Regular' }}>Esqueci minha senha</Text>

        <View className='w-full  flex flex-row justify-between '>
          <View className='w-1/2 flex flex-row items-center gap-2'>
            <CheckboxComponent checked={rememberMe} onChange={getCheckboxChange}  ></CheckboxComponent>
            <Text className=' text-sm text-lp-blue' style={{ fontFamily: 'Montserrat-Regular' }}>Lembrar minha senha ?</Text>
          </View>
          <View className='w-[45%] h-20 flex justify-center'>
            {/* <Recaptcha onVerify={handleRecaptchaVerify} /> */}
          </View>
        </View>
          
    
      
        <View className='my-3'>
          <ButtonComponent text='Confirmar'  actionKey='login' params={{ username, password, rememberMe }}></ButtonComponent>
        </View>

        <Text className='text-xs text-lp-blue w-full' style={{ fontFamily: 'Montserrat-Regular' }}>Ainda não tem uma conta? <Link href="/(screens)/public/register" className='font-montserrat text-xs text-lp-lightblue' style={{ fontFamily: 'Montserrat-Regular' }}>Criar Conta</Link></Text>
        
        <View className='w-full absolute bottom-1  left-10'>
          <Text className='text-center font-montserrat text-xs text-gray-400' style={{ fontFamily: 'Montserrat-Regular' }}>@Copyright 2023</Text> 
        </View>
      </View>     
    </View>
  )
}