/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {useEffect} from 'react';
import Navigation from './Navigation';
import {GlobalProvider} from './src/store/GlobalProvider';
import SplashScreen from 'react-native-splash-screen';

const App = props => {
  
  useEffect(() => {
    SplashScreen.hide();
  });
 
  return (
      <GlobalProvider>
      <Navigation/>       
    </GlobalProvider>      
  ); 
}

export default App;