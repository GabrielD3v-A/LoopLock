import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function CheckboxComponent() {
    const [isChecked, setChecked] = useState(false);

    return (
        <View className='flex flex-row items-center  rounded-full'>
            <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color='#03045E'
            />
      </View>
    );
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
  });
