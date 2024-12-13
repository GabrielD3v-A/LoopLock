import React from 'react'
import { StatusBar, View, Text } from 'react-native';

interface TemplateProps {
    children: React.ReactNode;
  }

const Template = ({ children }: TemplateProps) => {
    return (
      <View className="flex-1  w-full max-w-full max-h-screen mx-auto p-0 bg-white">
         <StatusBar barStyle="light-content" backgroundColor="#03045E" animated={true}/>
        {children} 
        
      </View>
    );
  };

export default Template;