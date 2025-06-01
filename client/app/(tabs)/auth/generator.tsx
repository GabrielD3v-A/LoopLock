import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import SlidersComponent from '@/components/slider';
import Checkbox from 'expo-checkbox';
import * as Clipboard from 'expo-clipboard';

export default function Generator() {
  const [checkedYesAmbiguous, setCheckedYesAmbiguous] = useState(false);
  const [checkedNotAmbiguous, setCheckedNotAmbiguous] = useState(false);
  const [checkedSpecial, setCheckedSpecial] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedLowercase, setCheckedLowercase] = useState(false);
  const [checkedUpperrcase, setCheckedUpperrcase] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [passwordgenerate, setPasswordGenerate] = useState('vazia'); // Estado para a senha gerada

  const [sliderValue, setSliderValue] = useState(8); // ou qualquer valor inicial

  const handlePress = () => {
    setIsLoading(true);
  
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
      setIsLoading(false);
      return;
    }
  
    let generatedPassword = '';
    for (let i = 0; i < sliderValue; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
  
    

    setPasswordGenerate(generatedPassword);
    setIsLoading(false);
  };

  const getTextSizeClass = () => {
    if (sliderValue > 20) return 'text-xs';
    if (sliderValue > 12) return 'text-sm';
    return 'text-base';
  };
  
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(passwordgenerate);
    alert('Senha copiada para a área de transferência!');
  };



  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-2xl font-bold'>Gerador de Senhas</Text>

      <View className='w-full h-14 flex flex-row items-center justify-between my-5 border-b-2 border-lp-blue'>
        <View className='w-4/5 ' >
          <TextInput numberOfLines={1}  placeholder={passwordgenerate} placeholderTextColor={'03045E'} keyboardType={'default'} editable={false} secureTextEntry={true} className={`font-bold text-left px-4 whitespace-nowrap text-lp-blue ${getTextSizeClass()}`}/>
          {/* <Text numberOfLines={1}  ellipsizeMode="tail" className={`font-bold text-left px-4 whitespace-nowrap ${getTextSizeClass()}`}>
            {passwordgenerate}
          </Text> */}
        </View>
        
        <View className='w-1/6 flex flex-row items-center justify-center absolute right-0 gap-x-1 px-2'>
          <TouchableOpacity
              onPress={() => {
                copyToClipboard();
              }}
            >
              <Image source={require('../../../assets/images/icons/copy-icon.png')} style={{ width: 28, height: 28 }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handlePress();
              }}
            >
              <Image source={require('../../../assets/images/icons/generate-icon-function.png')} style={{ width: 28, height: 28 }} />
            </TouchableOpacity>
        </View>
      </View>


      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.text}>Gerar</Text>
        )}
      </TouchableOpacity>

      <SlidersComponent value={sliderValue} onChange={setSliderValue} />

      <View className='w-full flex flex-column items-center justify-between my-5'>
        <Text className='text-lg font-bold'>Deseja carecteres ambíguos ?</Text>
        <View className='flex flex-row items-center gap-x-2'>
          <View>
            <Checkbox
              style={styles.checkbox}
              value={checkedYesAmbiguous}
              onValueChange={(newValue) => {
                setCheckedYesAmbiguous(newValue);
                if (newValue) setCheckedNotAmbiguous(false);
              }}
              color={checkedYesAmbiguous ? '#03045E' : undefined}
            />
            <Text>Sim</Text>
          </View>

          <View>
            <Checkbox
              style={styles.checkbox}
              value={checkedNotAmbiguous}
              onValueChange={(newValue) => {
                setCheckedNotAmbiguous(newValue);
                if (newValue) setCheckedYesAmbiguous(false);
              }}
              color={checkedNotAmbiguous ? '#03045E' : undefined}
            />
            <Text>Não</Text>
          </View>
        </View>
      </View>

      <View>
        <Checkbox
          style={styles.checkbox}
          value={checkedSpecial} // Vinculado ao estado do pai
          onValueChange={setCheckedSpecial}
          color={checkedSpecial ? '#03045E' : undefined}
        />
        <Text>Caracteres especiais (!@#$%^&*)</Text>
      </View>

      <View>
        <Checkbox
          style={styles.checkbox}
          value={checkedUpperrcase} // Vinculado ao estado do pai
          onValueChange={setCheckedUpperrcase}
          color={checkedUpperrcase ? '#03045E' : undefined}
        />
        <Text>Letras maiúsculas (A-Z)</Text>
      </View>
      <View>
        <Checkbox
          style={styles.checkbox}
          value={checkedLowercase} // Vinculado ao estado do pai
          onValueChange={setCheckedLowercase}
          color={checkedLowercase ? '#03045E' : undefined}
        />
        <Text>Letras minúsculas (a-z)</Text>
      </View>
      <View>
        <Checkbox
          style={styles.checkbox}
          value={checkedNumber} // Vinculado ao estado do pai
          onValueChange={setCheckedNumber}
          color={checkedNumber ? '#03045E' : undefined}
        />
        <Text>Números (1-9)</Text>
      </View>

    </View>


  )
}


const styles = StyleSheet.create({
    
    checkbox: {
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1.5,
        backgroundColor: '#CBCCF5',
    },
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