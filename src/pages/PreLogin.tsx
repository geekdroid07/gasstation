import { View, Text, Image } from 'react-native'
import React from 'react'
import { PrimaryButton } from '../components/Button'
import CustomButton from '../components/CustomButton'
import Logo from '../assets/images/logo2.jpeg'
export default function PreLogin({navigation}) {

  const config = () => {
    navigation.navigate('Login');
  }

  
  const SignIn = () => {
    navigation.navigate('HomeScreen');
  }

  return (
    <View style={{alignItems: 'center', marginTop: 40, marginBottom: 40}}>

        <View style={{alignItems: 'center', marginTop: 40, marginBottom: 40}}>
          <Image
            source={Logo}
            style={{
              resizeMode: 'contain',
              width: 250,
              height: 150,
            }}
          />
        </View>

        <CustomButton label={'CONFIGURAR'} onPress={config} />


        <PrimaryButton title="Iniciar Sesion" onPress={SignIn} />
      
    </View>
  )
}