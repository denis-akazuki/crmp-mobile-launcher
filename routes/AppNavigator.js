/**
 * Unity Launcher
 * Developed by Akazuki
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import Install from '../screens/Install';
import InstallApkActivity from '../screens/InstallApkActivity';
import LauncherUpdatedActivity from '../screens/LauncherUpdatedActivity';
import Settings from '../screens/Settings';

const Stack = createStackNavigator();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Install" component={Install} />
      <Stack.Screen name="InstallApkActivity" component={InstallApkActivity} />
      <Stack.Screen
        name="LauncherUpdatedActivity"
        component={LauncherUpdatedActivity}
      />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  </NavigationContainer>
);
