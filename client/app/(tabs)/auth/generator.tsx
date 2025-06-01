import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import SlidersComponent from '@/components/slider';
import Checkbox from 'expo-checkbox';
import * as Clipboard from 'expo-clipboard';

export default function Generator() {
  const [checkedYesAmbiguous, setCheckedYesAmbiguous] = useState(false);
  const [checkedNotAmbiguous, setCheckedNotAmbiguous] = useState(true);
  const [checkedSpecial, setCheckedSpecial] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(true);
  const [checkedLowercase, setCheckedLowercase] = useState(true);
  const [checkedUpperrcase, setCheckedUpperrcase] = useState(false);

  const [passwordgenerate, setPasswordGenerate] = useState('Sua nova senha...'); // Estado para a senha gerada

  const [sliderValue, setSliderValue] = useState(8); // ou qualquer valor inicial


  useEffect(() => {
    getTextSizeClass();
  }, [sliderValue])

  const handlePress = () => {
  
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
    
    let charset = '';
  
    if (checkedUpperrcase) charset += uppercaseChars;
    if (checkedLowercase) charset += lowercaseChars;
    if (checkedNumber) charset += numberChars;
    if (checkedSpecial) charset += specialChars;

    if(!checkedNotAmbiguous && !checkedYesAmbiguous) {
      setCheckedNotAmbiguous(true);
      return;
    }
  
    // Ambíguos SIM
    if (checkedYesAmbiguous) {
      charset += ambiguousChars;
    }
  
    // Ambíguos NÃO
    if (checkedNotAmbiguous) {
      for (let char of ambiguousChars) {
        charset = charset.replaceAll(char, '');
      }
    }
  
    // Validação: se nada for marcado
    if (charset.length === 0) {
      alert('Selecione pelo menos um tipo de caractere.');
      return;
    }
  
    let generatedPassword = '';
    for (let i = 0; i < sliderValue; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
  
    

    setPasswordGenerate(generatedPassword);
  };

  const getTextSizeClass = () => { 
    if (sliderValue > 20) return 'text-xs';
    if (sliderValue > 12) return 'text-sm';
    if (sliderValue < 20 && passwordgenerate.length > 20){
      return 'text-xs';
    }else{
      return 'text-base';
    }
  };
  
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(passwordgenerate);
    alert('Senha copiada para a área de transferência!');
  };



  return (
    <View className='flex-1 items-center justify-start bg-white px-8 gap-y-1'>
      <View className='w-full flex items-center justify-center'>
        <Text className='text-3xl font-normal text-lp-blue mt-10' style={{ fontFamily: 'Montserrat-Regular' }}>Password Generator</Text>
        <Text className='text-xs font-light text-center text-lp-blue mb-6'style={{ fontFamily: 'Montserrat-Light' }} >Crie senhas mais elaboradas com a Loop Lock.</Text>
        <Text className='text-xsm font-normal text-center text-lp-blue mb-2' style={{ fontFamily: 'Montserrat-Regular' }}>Selecione as especificações da sua senha</Text>
      </View>

      <View className='w-full h-auto mx-auto bg-lp-lilas-3 rounded-2xl p-4 flex flex-col items-center justify-between '>

        <View className='w-full h-auto flex flex-row items-center justify-between my-1 border-b border-lp-blue py-1'>
          <View className='w-4/5' >
            <Text className={`w-full font-bold text-left whitespace-nowrap text-lp-blue ${getTextSizeClass()}`} style={{ fontFamily: 'Montserrat-Medium' }}  >{passwordgenerate}</Text>
          </View>
          
          <View className='w-1/6 flex flex-row items-center justify-center gap-x-1'>
            <TouchableOpacity
                onPress={() => {
                  copyToClipboard();
                }}
              >
                <Image source={require('../../../assets/images/icons/copy-icon.png')} className='w-9 h-9' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handlePress();
                }}
              >
                <Image source={require('../../../assets/images/icons/generate-icon-function.png')} className='w-9 h-9' />
              </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className='flex items-center justify-center w-44 bg-lp-lightblue py-1 rounded-full my-4'
          onPress={handlePress}>
          <Text className='text-white font-medium text-lg' style={{ fontFamily: 'Montserrat-Medium' }}>Gerar</Text>
        </TouchableOpacity>

        <View className='w-full flex flex-row items-start justify-between my-3'>
          <View className='w-1/2'>
            <SlidersComponent value={sliderValue} onChange={setSliderValue} />
          </View>

          <View className='w-1/2 flex flex-column items-center justify-between gap-y-2'>

            <Text className='text-center text-lp-blue text-[9px]' style={{ fontFamily:'Montserrat-Medium' }}>Deseja carecteres ambíguos ?</Text>

            <View className='w-full flex flex-row items-center justify-around'>
              <View className='flex flex-row items-center justify-center gap-x-1'>
                <Checkbox
                  style={styles.checkbox}
                  value={checkedYesAmbiguous}
                  onValueChange={(newValue) => {
                    setCheckedYesAmbiguous(newValue);
                    if (newValue) setCheckedNotAmbiguous(false);
                  }}
                  color={checkedYesAmbiguous ? '#03045E' : undefined}
                />
                <Text className='text-left text-lp-blue text-sm' style={{ fontFamily:'Montserrat-Light' }}>Sim</Text>
              </View>

              <View className='flex flex-row items-center justify-center gap-x-1'>
                <Checkbox
                  style={styles.checkbox}
                  value={checkedNotAmbiguous}
                  onValueChange={(newValue) => {
                    setCheckedNotAmbiguous(newValue);
                    if (newValue) setCheckedYesAmbiguous(false);
                  }}
                  color={checkedNotAmbiguous ? '#03045E' : undefined}
                />
                <Text className='text-left text-lp-blue text-sm' style={{ fontFamily:'Montserrat-Light' }}>Não</Text>
              </View>
            </View>
          </View>
                
        </View>        

        <View className='w-full flex flex-col items-center justify-center gap-y-2'>
          <Text className='text-center text-lp-blue text-base font-medium my-2' style={{ fontFamily:'Montserrat-Medium' }}>Características da senha </Text>

          <View className='w-full flex flex-row items-start justify-between bg-lp-lilas shadow-xl rounded-full p-4'>
            <Text className='text-lp-blue text-sm' style={{ fontFamily:'Montserrat-Light' }}>Letras minúsculas (a-z)</Text>
            <Checkbox
              style={styles.checkbox}
              value={checkedLowercase} // Vinculado ao estado do pai
              onValueChange={setCheckedLowercase}
              color={checkedLowercase ? '#03045E' : undefined}
            />
          </View>

          <View className='w-full flex flex-row items-start justify-between bg-lp-lilas shadow-xl rounded-full p-4'>
            <Text className='text-lp-blue text-sm' style={{ fontFamily:'Montserrat-Light' }}>Letras maiúsculas (A-Z)</Text>
            <Checkbox
              style={styles.checkbox}
              value={checkedUpperrcase} // Vinculado ao estado do pai
              onValueChange={setCheckedUpperrcase}
              color={checkedUpperrcase ? '#03045E' : undefined}
            />
          </View>

          <View className='w-full flex flex-row items-start justify-between bg-lp-lilas shadow-xl rounded-full p-4'>
            <Text className='text-lp-blue text-sm' style={{ fontFamily:'Montserrat-Light' }}>Números (1-9)</Text>
            <Checkbox
              style={styles.checkbox}
              value={checkedNumber} // Vinculado ao estado do pai
              onValueChange={setCheckedNumber}
              color={checkedNumber ? '#03045E' : undefined}
            />
          </View>

          <View className='w-full flex flex-row items-start justify-between bg-lp-lilas shadow-xl rounded-full p-4'>
              <Text className='text-lp-blue text-sm' style={{ fontFamily:'Montserrat-Light' }}>Caracteres especiais (!@#$%^&*)</Text>
              <Checkbox
                style={styles.checkbox}
                value={checkedSpecial} // Vinculado ao estado do pai
                onValueChange={setCheckedSpecial}
                color={checkedSpecial ? '#03045E' : undefined}
              />
            </View>
        </View>


      </View>


    </View>


  )
}


const styles = StyleSheet.create({  
    checkbox: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderWidth: 1,
      backgroundColor: '#CBCCF5',
    },
  });