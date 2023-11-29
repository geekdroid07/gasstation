import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';

import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import InputField from '../components/InputField';
import { PrimaryButton } from '../components/Button';
import displayToast from '../utilities/toast.utility';
import { LOCALSTORAGE_TOKEN } from '../const';
import { modifyUser } from '../redux/slices/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Login({navigation}) {

  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Ingrese un correo electrónico valido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(8, 'Debe ser minimo 8 caracteres')
      .required('Ingrese una contraseña'),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Las contraseñas deben coincidir'
    )
  });



  const initialValues = {
    URL: '',
    URL_SORTEOS: '',
    method: ''
  };

  
  const {handleSubmit, handleChange, setFieldValue, values, errors, handleBlur, touched} =
    useFormik({
      initialValues,
      onSubmit: async (formValues) => {
        try {
          if (formValues.URL.length > 0 && formValues.method.length > 0 && formValues.URL_SORTEOS.length > 0) {
            await AsyncStorage.setItem(LOCALSTORAGE_TOKEN, JSON.stringify(formValues));
            dispatch(modifyUser(formValues));
            displayToast('GUARDADO CORRECTAMENTE', 'info');
            navigation.navigate('PreLogin')
          } else {
            displayToast('Por favor llenar todos los campos', 'info')
          }
        } catch (error: any) {
          console.log(error);
          
          displayToast('Ocurrió un error', 'info')
        }
      }
    });

    const getURL = async () => {
      const info = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);
      const urlinfo = JSON.parse(info as string);
      if (urlinfo) {
        setFieldValue('URL_SORTEOS', urlinfo.URL_SORTEOS);
        setFieldValue('URL', urlinfo.URL);
        setFieldValue('method', urlinfo.method);
      }
    }
  
    useEffect(() => {
      getURL();
    }, [])
  
  return (
    <View>
     
      <KeyboardAvoidingView behavior="position">
 
      <TouchableOpacity
        onPress={() => navigation.navigate('PreLogin')}
        className="mt-6 ml-4 mb-36">
        <Ionicons
          name="arrow-back"
          size={50}
          onPress={() => navigation.navigate('PreLogin')}
          style={{height: 50, width: 50}}
        />
      </TouchableOpacity>
      
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <>

          <InputField
            label={'API URL FOR SORTEOS'}
            handleChange={handleChange('URL_SORTEOS')}
            handleBlur={handleBlur('URL_SORTEOS')}
            inputType='text'
            value={values.URL_SORTEOS}
            fieldButtonFunction={() => {}}
            fieldButtonLabel=''
            icon={null}
            keyboardType="default"
          />


          <InputField
            label={'API URL'}
            handleChange={handleChange('URL')}
            handleBlur={handleBlur('URL')}
            inputType='text'
            value={values.URL}
            fieldButtonFunction={() => {}}
            fieldButtonLabel=''
            icon={null}
            keyboardType="default"
          />

          <InputField
            label={'METHOD'}
            value={values.method}
            keyboardType={'default'}
            handleChange={handleChange('method')}
            handleBlur={handleBlur('method')}
            icon={null}
            inputType="text"
            fieldButtonLabel=''
            fieldButtonFunction={() => {}}
          />
          
          <PrimaryButton title="Guardar" onPress={handleSubmit} />
        </>
      </Formik>

      </KeyboardAvoidingView>
    </View>
  );
}
