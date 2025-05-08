import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import SlidersComponent from '@/components/slider';
import Checkbox from 'expo-checkbox';

export default function Generator() {
  const [checkedYesAmbiguous, setCheckedYesAmbiguous] = useState(false);
  const [checkedNotAmbiguous, setCheckedNotAmbiguous] = useState(false);
  const [checkedSpecial, setCheckedSpecial] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedLowercase, setCheckedLowercase] = useState(false);
  const [checkedUpperrcase, setCheckedUpperrcase] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [passwordgenerate, setPasswordGenerate] = useState('vazia'); // Estado para a senha gerada

  const handlePress = () => {
    console.log(`Nenhuma função encontrada para a chave: `);
  };


  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-2xl font-bold'>Gerador de Senhas</Text>

      <View className='w-full flex flex-column items-center justify-between my-5 border-b-2 border-lp-blue'>
        <Text className='text-lg font-bold'>{passwordgenerate}</Text>
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

      <SlidersComponent></SlidersComponent>

      <View className='w-full flex flex-column items-center justify-between my-5'>
        <Text className='text-lg font-bold'>Deseja carecteres ambíguos ?</Text>
        <View className='flex flex-row items-center gap-x-2'>
          <View>
            <Checkbox
              style={styles.checkbox}
              value={checkedYesAmbiguous} // Vinculado ao estado do pai
              onValueChange={setCheckedYesAmbiguous}
              color={checkedYesAmbiguous ? '#03045E' : undefined}
            />
            <Text>Sim</Text>
          </View>

          <View>
            <Checkbox
              style={styles.checkbox}
              value={checkedNotAmbiguous} // Vinculado ao estado do pai
              onValueChange={setCheckedNotAmbiguous}
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


