/**
 * Unity Launcher
 * Developed by Akazuki
 */

import 'react-native-gesture-handler';
import React from 'react';
import {AppNavigator} from './routes/AppNavigator';
import Bugsnag from '@bugsnag/react-native';

const App: () => React$Node = () => {
  Bugsnag.start();
  return (
    <>
      <AppNavigator />
    </>
  );
};

export default App;
