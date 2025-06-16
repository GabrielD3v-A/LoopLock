import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import SafeProvider, { useSafe } from '@/app/context/SafeContext'
import { Pressable, TextInput } from 'react-native-gesture-handler';

export default function CreateCredentialWrapper() {
  return (
    <SafeProvider>
      <CreateCredential />
    </SafeProvider>
  );
}

function CreateCredential() {
  const { onCreateSafe } = useSafe();

  const [place, setPlace] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [domain, setDomain] = React.useState('');

  const handleCreateCredential = () => {
    
  };

  const handleDiscardCredential = () => {
    
  };

  return (
    <View className='flex-1 items-center justify-start bg-white px-8 gap-y-1'>
      <Text className='text-3xl font-normal text-lp-blue mt-10 mb-5' style={{ fontFamily: 'Montserrat-Regular' }}>Manage Password</Text>

      <View className='w-full flex flex-col items-center justify-start gap-y-2 h-auto bg-lp-lilas-3 rounded-2xl px-8 py-5'>
        
        <View className='flex flex-col items-start gap-y-1 w-full mt-6'>
          <Text className='text-lp-blue text-sm text-left' style={{ fontFamily: 'Montserrat-Medium' }}>Nome da plataforma</Text>
          <View className='w-full flex flex-row items-center gap-x-1 bg-lp-lilas rounded-lg px-3 h-14'>
            <Image source={require('@/assets/images/credentials/template.png')} className='w-7 h-7'/>
            <TextInput 
              className='w-11/12 h-full text-lp-blue text-sm pt-4' 
              placeholder='Selecionar plataforma' 
              placeholderTextColor='#03045E' 
              style={{ fontFamily:'Montserrat-Regular' }}
              onChangeText={setPlace}
              numberOfLines={1}
              maxLength={30}
              >  
            </TextInput>
          </View>
        </View>

        <View className='flex flex-col items-start gap-y-1 w-full mt-6'>
          <Text className='text-lp-blue text-sm text-left' style={{ fontFamily: 'Montserrat-Medium' }}>Dominio</Text>
          <TextInput 
            className='w-full h-14 bg-lp-lilas rounded-lg text-lp-blue px-3 text-sm' 
            placeholder='Adicione seu username' 
            placeholderTextColor='#03045E' 
            style={{ fontFamily:'Montserrat-Regular' }}
            onChangeText={setDomain}
            numberOfLines={1}
            >
          </TextInput>
        </View>

        <View className='flex flex-col items-start gap-y-1 w-full mt-6'>
          <Text className='text-lp-blue text-sm text-left' style={{ fontFamily: 'Montserrat-Medium' }}>Username ou e-mail</Text>
          <TextInput 
            className='w-full h-14 bg-lp-lilas rounded-lg text-lp-blue px-3 text-sm' 
            placeholder='Adicione seu username' 
            placeholderTextColor='#03045E' 
            style={{ fontFamily:'Montserrat-Regular' }}
            onChangeText={setUsername}
            numberOfLines={1}
            autoComplete={'email'}
            maxLength={30}
            >
          </TextInput>
        </View>

        <View className='flex flex-col items-start gap-y-1 w-full mt-6'>
          <Text className='text-lp-blue text-sm text-left' style={{ fontFamily: 'Montserrat-Medium' }}>Senha</Text>
          <TextInput 
            className='w-full h-14 bg-lp-lilas rounded-lg text-lp-blue px-3 text-sm ' 
            placeholder='sua senha'
            placeholderTextColor='#03045E'  
            style={{ fontFamily:'Montserrat-Regular' }}
            onChangeText={setPassword}
            numberOfLines={1}
            secureTextEntry={true}
            >
          </TextInput>
          <Text className='text-[0.45rem] text-lp-blue font-regular' style={{ fontFamily:'Montserrat-Regular' }}>Certifique-se que sua senha é válida na plataforma que está editando.</Text>
        </View>



        <View className='w-full flex flex-row items-center justify-center gap-x-8 mt-10'>
          <Pressable onPress={handleDiscardCredential}>
            <Text className='text-lp-blue text-base underline' style={{ fontFamily: 'Montserrat-Medium' }}>Descartar</Text>
          </Pressable>
          <View className='w-24'>
            <TouchableOpacity onPress={handleCreateCredential}>
              <View className='flex flex-row items-center justify-center w-full bg-lp-lightblue py-2 rounded-full'>
                <Text className='text-white text-base font-semibold' style={{ fontFamily: 'Montserrat-Medium' }}>Salvar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
