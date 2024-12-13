import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface PasswordStrengthSliderProps {
    onChange: string; // Senha recebida para avaliação
    onStrengthChange: (strength: number) => void; // Callback para enviar a força da senha
  }
  

  const PasswordStrengthSlider: React.FC<PasswordStrengthSliderProps> = ({ onChange, onStrengthChange }) => {
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0); // Nível de força da senha (0 a 100)
    
    
       
    const evaluateStrength = (input: string) => {
        let score = 0;

        // Comprimento mínimo de 12 caracteres
        if (input.length >= 12) score += 25;

        // Contém pelo menos uma letra maiúscula
        if (/[A-Z]/.test(input)) score += 25;

        // Contém pelo menos uma letra minúscula
        if (/[a-z]/.test(input)) score += 25;

        // Contém pelo menos um número
        if (/[0-9]/.test(input)) score += 15;

        // Contém pelo menos um símbolo
        if (/[^A-Za-z0-9]/.test(input)) score += 10;

        return score;
    };

    useEffect(() => {
        setPassword(onChange);
        setStrength(evaluateStrength(onChange));
        onStrengthChange(evaluateStrength(onChange))
      }, [onChange]);
    
  
    return (
        <View style={style.container}>
            <View style={style.containerBar}>
                <View
                style={{
                    height: '100%',
                    borderRadius: 5,
                    width: `${strength}%`,
                    backgroundColor: strength < 50 ? '#CBCCF5' : strength < 75 ? '#0096C7' : strength > 75? '#03045E' : '#023E8A',
                }}
                />
            </View>
        
        </View>
    );
};

const style = StyleSheet.create({
    container:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:10,
        marginVertical:0,
    },
    containerBar:{
        width:'100%',
        height:'100%',
        borderRadius:100,
        backgroundColor:'#DEDFFC'
    }

});

export default PasswordStrengthSlider;
