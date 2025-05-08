import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Slider, Icon } from '@rneui/themed';

type SlidersComponentProps = {
    value: number;
    onChange: (val: number) => void;
};
  
const SlidersComponent: React.FC<SlidersComponentProps> = ({ value, onChange }) => {
    // ... (remova o useState interno para value)
  
    const interpolate = (start: number, end: number) => {
      let k = (value - 0) / 100; // 0 => min, 100 => max
      return Math.ceil((1 - k) * start + k * end) % 256;
    };
  
    const color = () => {
      let r = interpolate(255, 0);
      let g = interpolate(0, 255);
      let b = interpolate(0, 0);
      return `rgb(${r},${g},${b})`;
    };
  
    return (
      <>
        <Text style={styles.subHeader}>Tamanho da senha</Text>
        <View style={[styles.contentView]}>
          <Slider
            value={value}
            onValueChange={onChange}
            maximumValue={100}
            minimumValue={1}
            step={1}
            allowTouchTrack
            trackStyle={{ height: 5, backgroundColor: 'transparent' }}
            thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
            thumbProps={{
              children: (
                <Icon
                  name="heartbeat"
                  type="font-awesome"
                  size={20}
                  reverse
                  containerStyle={{ bottom: 20, right: 20 }}
                  color={color()}
                />
              ),
            }}
          />
          <Text style={{ paddingTop: 20 }}>Tamanho: {value}</Text>
        </View>
      </>
    );
};

const styles = StyleSheet.create({
  contentView: {
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  subHeader: {
    backgroundColor: '#2089dc',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
    marginBottom: 10,
  },
});

export default SlidersComponent;
