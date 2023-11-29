import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

// import Login from '../pages/Auth';
// import Splash from '../pages/Splash';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import CustomDrawer from '../components/CustomDrawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../pages/HomeScreen';
import Login from '../pages/Login';
import Splash from '../pages/Splash';
import PreLogin from '../pages/PreLogin';
import { enableScreens } from 'react-native-screens';
import Payments from '../pages/Payments';
enableScreens(true);
const Drawer = createDrawerNavigator();


function Navigation() {


  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff'
    }
  };

  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
         initialRouteName="Splash"
         screenOptions={({navigation}) => ({
           swipeEnabled: true,
           drawerPosition: 'left',
           drawerType: 'front',
           iconContainerStyle: { paddingLeft: 20, marginLeft: 20 },
           drawerActiveTintColor: '#3f51b5',
           headerBackgroundContainerStyle: {
            backgroundColor: '#3f51b5'
           },
           drawerLabelStyle: { marginLeft: -15, fontSize: 16, color: 'black' }
         })}
         drawerContent={(props) => <CustomDrawer {...props} />}
      >
        
        <Drawer.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerTitle:'Listado de Ventas',
            title: 'Home',
            drawerIcon: () => (
              <View
                style={{
                  backgroundColor: '#3f51b5',
                  borderRadius: 50,
                  padding: 5
                }}
              >
                <Icon name={'home'} color={'white'} size={18} />
              </View>
            )
          }}
        />


        <Drawer.Screen
          name="Payments"
          component={Payments}
          options={{
            headerTitle:'Pagos',
            title: 'Pagos',
            drawerIcon: () => (
              <View
                style={{
                  backgroundColor: '#3f51b5',
                  borderRadius: 50,
                  padding: 5
                }}
              >
                <Icon name={'money'} color={'white'} size={18} />
              </View>
            )
          }}
        />

        <Drawer.Screen
          name="PreLogin"
          component={PreLogin}
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false
          }}
        />

        <Drawer.Screen
          name="Login"
          component={Login}
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false
          }}
        />

        <Drawer.Screen
          name="Splash"
          component={Splash}
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false
          }}
        />
      </Drawer.Navigator>
     
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  withIcon: {
    flexDirection: 'row',
    alignContent: 'center',
    flex: 1
  },
  iconWithText: {
    marginRight: 10,
    paddingLeft: 20
  },
  textWithIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RobotoBold',
  },
  container: {
  },
  menuicon: { 
    backgroundColor: '#000500',
    alignSelf: 'center',
    marginTop: 10,
    // position: 'absolute',
    marginLeft: 10,
    position: 'relative',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    paddingTop: 13,
    paddingLeft: 13,
    borderRadius: 100 
  }
});


export default Navigation;
