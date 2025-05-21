import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';

type SlidersComponentProps = {
  value: number;
  onChange: (val: number) => void;
};

const SlidersComponent: React.FC<SlidersComponentProps> = ({ value, onChange }) => {
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
          step={1}
          minimumValue={1}
          maximumValue={100}
          value={value}
          onValueChange={onChange}
          style={styles.slider}
          minimumTrackTintColor={color()}
          maximumTrackTintColor="#000000"
        />
        <Text style={{ paddingTop: 20 }}>Tamanho: {value}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    opacity: 1,
    marginTop: 10,
  },
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
