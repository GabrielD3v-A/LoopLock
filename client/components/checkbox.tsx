import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Checkbox from 'expo-checkbox';

interface CheckboxComponentProps {
    checked: boolean;
    onChange: (value: boolean) => void;
}

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ checked, onChange }) => {
    return (
        <View className='flex flex-row items-center  rounded-full'>
            <Checkbox
                style={styles.checkbox}
                value={checked} // Vinculado ao estado do pai
                onValueChange={onChange} // Propaga mudanças para o pai
                color={checked ? '#03045E' : undefined}
            />
      </View>
    );
}

export default CheckboxComponent;

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
  });
