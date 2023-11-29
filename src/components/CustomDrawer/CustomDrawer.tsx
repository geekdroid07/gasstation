import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { Image, ImageBackground, Platform, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { resetUser } from '../../redux/slices/user';

function CustomDrawer(props) {

  const logout = async () => {
    try {
      props.navigation.navigate('PreLogin')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 15,
            marginTop: 10
          }}
        >
          <Icon
            name="close-circle-sharp"
            size={28}
            onPress={() => props.navigation.toggleDrawer()}
          />
        </View>
        <DrawerContentScrollView {...props}>
          
          <DrawerItemList {...props} />

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            
            <View style={styles.footer}>
              <TouchableOpacity onPress={logout}>
                  <Text>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
          </View>
        </DrawerContentScrollView>
    </View>
  );
}

const styles = {
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#919191',
    paddingBottom: 20,
    marginBottom: 10,
    marginTop: Platform.OS === 'android' ? 0 : -30
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white'
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  email: { fontWeight: '300', flex: 1 },
  footer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    marginTop: 20
  }
};

export default CustomDrawer;
