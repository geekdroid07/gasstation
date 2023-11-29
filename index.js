/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import App from './App';
import store from './src/redux/store';
import { name as appName } from './app.json';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NativeBaseProvider } from 'native-base';
import { TailwindProvider } from 'tailwindcss-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RNRedux = () => (
    <Provider store={store}>
      <RootSiblingParent>
        <NativeBaseProvider>
            <TailwindProvider>
              <SafeAreaProvider>
                <App />
              </SafeAreaProvider>
            </TailwindProvider>
          </NativeBaseProvider>
      </RootSiblingParent>
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
