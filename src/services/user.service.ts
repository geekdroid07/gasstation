import axios from 'axios';
import Config from 'react-native-config';
import { loadAbort } from '../utilities';

// const usersURL = 'http://192.168.0.109:4000/auth';
const usersURL = Config.AUTH_URL;

export const getUser = (uid: string) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${usersURL}/GetUser/${uid}`, {
        signal: controller.signal
      }),
    controller
  };
};


export const GetDriverLocationId = (id: number) => {
  const controller = loadAbort();
  return {
    call: () =>
      axios.get(`${usersURL}/GetDriverLocationId/${id}`, {
        signal: controller.signal
      }),
    controller
  };
};