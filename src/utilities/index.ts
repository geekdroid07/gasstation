export * from './load-abort.utility';
import axios from 'axios';
import { LOCALSTORAGE_TOKEN } from '../const';
import { GOOGLE_MAPS_APIKEY } from '../const';
import AsyncStorage from '@react-native-async-storage/async-storage';

let token
export const getToken = async () => {
  if(token) return token;

  token = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);

  return token || null;
};
