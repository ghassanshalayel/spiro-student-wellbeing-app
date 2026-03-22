import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import MapScreen from './screens/MapScreen';
import GalleryScreen from './screens/GalleryScreen';
import SettingsScreen from './screens/SettingsScreen';

import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Pet" component={HomeScreen} options={{headerShown: false }} />
        <Stack.Screen name="Map" component={MapScreen} options={{headerShown: false }} />
        <Stack.Screen name="Gallery" component={GalleryScreen} options={{headerShown: false }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}