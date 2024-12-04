import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const Recaptcha = ({ onVerify }) => {
  const [showCaptcha, setShowCaptcha] = useState(false);

  const captchaHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://www.google.com/recaptcha/api.js"></script>
      </head>
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
    <View style={{ flex: 1 }}>
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
