import React, { useRef, useState } from 'react';
import { View, Button } from 'react-native';
import ReCAPTCHA from 'react-google-recaptcha';

interface RecaptchaProps {
  onVerify: (token: string) => void;
}

const Recaptcha = ({ onVerify }: RecaptchaProps) => {
  const [showCaptcha, setShowCaptcha] = useState(false);

  const recaptcha = useRef<ReCAPTCHA | null>(null); // Explicit type assertion

  if (!process.env.REACT_APP_SITE_KEY) {
    throw new Error('REACT_APP_SITE_KEY environment variable is not set');
  }
  
  return (
    <View className='w-full h-full'>
      {showCaptcha ? (
        <ReCAPTCHA ref={recaptcha as any} sitekey={process.env.REACT_APP_SITE_KEY} />
      ) : (
        <Button title="Exibir reCAPTCHA" onPress={() => setShowCaptcha(true)} />
      )}
    </View>
  );
};

export default Recaptcha;