import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import tw from 'twrnc'
import { useSelector } from 'react-redux'
import 'react-native-gesture-handler'

export default function Splash({ navigation }) {
  const user = useSelector((state: any) => state.user);
  const order = useSelector((state: any) => state.order);



  const goToScreen = (routeName) => {
    navigation.navigate(routeName)
  }

  useEffect(() => {
    setTimeout(() => {
      goToScreen('PreLogin')
    }, 2000);
  }, [])

  return (
    <View style={tw.style('flex h-full justify-center items-center bg-white')}>
      <Image
        source={require('../assets/images/logo.jpeg')}  
        style={{
          width: 340,
          height: 200
        }} 
      />
    </View>
  )
}
