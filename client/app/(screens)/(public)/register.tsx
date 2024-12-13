import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router';
import Logo from '@/components/logo';
import InputComponent from '@/components/Input';
import ButtonComponent from '@/components/button';
import CheckboxComponent from '@/components/checkbox';
import PasswordStrengthSlider from '@/components/rangePassword';
import Recaptcha from '@/components/recaptcha';
import Slider from '@react-native-community/slider';

export default function register() {
    const[username, setUsername] = useState('');
    const[email, setEmail] = useState('');
    const[passwordMaster, setPasswordMaster] = useState('');
    const[confirmPasswordMaster, setConfirmPasswordMaster] = useState('');
    const[passwordStrength, setPasswordStrength] = useState(0); // Força da senha
    const[terms, setTerms] = useState(false);

    useEffect(() => {
      setUsername('');
      setEmail('');
      setPasswordMaster('');
      setConfirmPasswordMaster('');
      setPasswordStrength(0);
      setTerms(false);
    }, []);

    const getCheckboxChange = (checked: boolean) => {
      setTerms(checked);
    };

    const getPasswordStrengthChange = (strength: number) => {
      setPasswordStrength(strength);
    };
  
    const getUsernameChange = (value: string) => {
      setUsername(value);
    }

    const getEmailChange = (value: string) => {
      setEmail(value);
    }
    const getPasswordChange = (value: string) => {
      setPasswordMaster(value);
    }
    const getConfirmPasswordChange = (value: string) => {
      setConfirmPasswordMaster(value);
    }

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
            <InputComponent textPlaceholder='Nome completo' icon={false} password={false} onChange={getUsernameChange}></InputComponent>
            <InputComponent textPlaceholder='E-mail' icon={false} password={false} onChange={getEmailChange}></InputComponent>
            <InputComponent textPlaceholder='Senha mestra' icon={true} password={true} onChange={getPasswordChange}></InputComponent>
            <Text className='font-montserrat font-thin text-xs text-lp-blue w-full text-start '>Sua senha mestra deve conter no mínimo 12 carecteres, além de ser composta por letras maiúsculas, minúsculas, números e símbolos.</Text>

            <PasswordStrengthSlider onChange={passwordMaster} onStrengthChange={getPasswordStrengthChange} />

            <InputComponent textPlaceholder='Confirme sua senha mestra' icon={true} password={true} onChange={getConfirmPasswordChange}></InputComponent>
          </View>

          <View className='w-full  flex flex-row justify-between '>
            <View className='w-1/2 flex flex-row items-center gap-2'>
              <CheckboxComponent checked={terms} onChange={getCheckboxChange}></CheckboxComponent>
              <Text className='font-montserrat text-sm text-lp-blue underline'>Eu li e aceitos os termos</Text>
            </View>
            <View className='w-[45%] h-20 flex justify-center'>
              {/* <Recaptcha onVerify={handleRecaptchaVerify} /> */}
            </View>
          </View>
            
          
          <View className='my-6'>
            <ButtonComponent text='Confirmar'  actionKey='register' params={{username, email, passwordMaster, confirmPasswordMaster, passwordStrength, terms}}></ButtonComponent>
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

