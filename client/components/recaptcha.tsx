import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

interface RecaptchaProps {
  onVerify: (token: string) => void;
}

const Recaptcha = ({ onVerify }: RecaptchaProps) => {
  const [showCaptcha, setShowCaptcha] = useState(false);

  const captchaHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://www.google.com/recaptcha/api.js"></script>
      </head>
      <style>
        .g-recaptcha {
          transform: scale(1.5) translate(-23%, -70%); /* Ajuste o valor para o tamanho desejado */
          transform-origin: center; /* Fixa o ponto de origem ao canto superior esquerdo */
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
      </style>
      <body>
        <div class="g-recaptcha" 
             data-sitekey="6LdxhJIqAAAAAM8snmbWvo4pD9i05OnpoL2eOLPK" 
             data-callback="onSuccess">
        </div>
        <script>
          function onSuccess(token) {
            window.ReactNativeWebView.postMessage(token);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View className='w-full h-full'>
      {showCaptcha ? (
        <WebView 
          originWhitelist={['*']}
          source={{ html: captchaHTML }}
          onMessage={(event) => {
            setShowCaptcha(false);
            onVerify(event.nativeEvent.data);
          }}
          
        />
      ) : (
        <Button title="Exibir reCAPTCHA" onPress={() => setShowCaptcha(true)} />
      )}
    </View>
  );
};


export default Recaptcha;
