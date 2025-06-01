import { View, Text } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';

type SlidersComponentProps = {
  value: number;
  onChange: (val: number) => void;
};

const SlidersComponent: React.FC<SlidersComponentProps> = ({ value, onChange }) => {
  const progress = useSharedValue(value);
  const min = useSharedValue(4);
  const max = useSharedValue(100);


  return (
    <View className="flex flex-col justify-center items-center w-full">
      <Text className="text-center text-lp-blue text-[9px]" style={{ fontFamily: 'Montserrat-Medium' }}>
        Quantidade de caracteres
      </Text>

      <Slider
        theme={{
          disableMinTrackTintColor: '#CBCCF5',
          maximumTrackTintColor: '#CBCCF5',
          minimumTrackTintColor: '#03045E',
          cacheTrackTintColor: '#03045E',
          bubbleBackgroundColor: '#03045E',
          heartbeatColor: '#03045E',
        }}
        forceSnapToStep={true}
        bubble={(s) => `${Math.round(s)}`}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        sliderHeight={10}
        
        style={{ width: '90%', marginVertical:15, borderRadius: 100, }}
        onValueChange={(progress) => {
          onChange(Math.round(progress)); // Atualiza o valor arredondado
        }
        }
      />

      <Text className="text-center text-lp-blue text-[9px]" style={{ fontFamily: 'Montserrat-Light' }}>
        {Math.round(value)} caracteres
      </Text>
    </View>
  );
};

export default SlidersComponent;
