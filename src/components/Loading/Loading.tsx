import React, { useEffect, useState } from 'react';
import { Image, View, Text, Animated } from 'react-native';
import Logo2 from '../../assets/images/logo2.jpeg';
import tw from 'twrnc';
import FadeInOut from 'react-native-fade-in-out';

function Loading({ title, isFull = true }) {
  const [visible, setVisible] = useState(true);

  const toggleVisible = () => {
    setVisible((visible) => !visible);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      toggleVisible();
    }, 700);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View
      style={tw.style(
        `flex ${isFull ? 'h-[80%]' : ''} justify-center bg-[#fff] px-6`
      )}
    >
      <FadeInOut visible={visible} duration={500}>
        <Image
          style={tw.style('self-center w-30 h-30 mb-4')}
          source={Logo2}
        />
        {title && <Text style={tw.style('self-center')}>{title}</Text>}
      </FadeInOut>
    </View>
  );
}

export default Loading;
