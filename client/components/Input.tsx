import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InputComponentProps {
    textPlaceholder: string;
    icon: boolean;
    password: boolean;
    onChange: (value: string) => void;
    value: string | null;
}

const InputComponent: React.FC<InputComponentProps> = ({ textPlaceholder, icon, password, onChange, value }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(password);




    const togglePasswordVisibility = () => {
        if(isPasswordVisible){
            setPasswordVisible(false)
        }else{
            setPasswordVisible(true);
        }
        
    };

    return (
        <View className='w-full font-montserrat text-lp-blue text-base flex flex-row items-center'>
            <TextInput numberOfLines={1} style={styles.CustomStyleInput} placeholder={textPlaceholder} placeholderTextColor="#03045E" keyboardType={'default'}  secureTextEntry={isPasswordVisible}  onChangeText={onChange} autoCapitalize={'none'} value={value ?? ''}/>
            {icon? <TouchableOpacity className='flex justify-center items-center ' onPress={togglePasswordVisibility}><Image source={require('../assets/images/eye-icon.png')} resizeMode='contain' style={styles.CustomStyleIcon}  /></TouchableOpacity>: ''}
        </View>
    );
};

const styles = StyleSheet.create({
    CustomStyleInput: {
        'display': 'flex',
        alignItems: 'center',
        width:'100%',
        borderRadius: 6,
        fontSize: 12, 
        fontFamily: 'Montserrat-Regular',
        color: "#03045E",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#03045E",
        paddingLeft: 10,
        paddingRight: 45,
        paddingVertical: 15,
    },
    CustomStyleIcon:{
        width: 25,
        position: 'absolute',
        top: -35,
        right: 10,
        zIndex: 1

    }
});

export default InputComponent;
