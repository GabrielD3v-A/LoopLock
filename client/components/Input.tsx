import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InputComponentProps {
    textPlaceholder: string;
    icon: boolean;
    password: boolean;
    onChange: (value: string) => void;
    value?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({ textPlaceholder, icon, password, onChange, value }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(password);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    return (
        <View className="w-full font-montserrat text-lp-blue text-base flex flex-row items-center relative">
            <TextInput
                numberOfLines={1}
                style={styles.CustomStyleInput}
                placeholder={textPlaceholder}
                placeholderTextColor="#03045E"
                keyboardType="default"
                secureTextEntry={password && isPasswordVisible}
                onChangeText={onChange}
                autoCapitalize="none"
                value={value}
            />
            {icon && (
                <TouchableOpacity
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onPress={togglePasswordVisibility}
                >
                    <Image
                        source={require('../assets/images/eye-icon.png')}
                        resizeMode="contain"
                        style={styles.CustomStyleIcon}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    CustomStyleInput: {
        width: '100%',
        borderRadius: 6,
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: '#03045E',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#03045E',
        paddingLeft: 10,
        paddingRight: 45,
        paddingVertical: 15,
    },
    CustomStyleIcon: {
        width: 25,
        height: 25,
    },
});

export default InputComponent;
