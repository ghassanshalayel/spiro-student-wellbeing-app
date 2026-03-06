import { StatusBar } from 'expo-status-bar';
import { use, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as dataInit from './backend/Initialiser';
import * as userSteps from './backend/Steps';
import * as userSettings from './backend/Settings';

export default function App() {

  // SMALL NOTE THIS IS FOR TESTING ONLY 
  
  // const [dailySteps, setDailySteps] = useState(0);
  // const [username, setUsername] = useState("");

  // const resetLifetimeData = async () => {
  //   await userSteps.resetLifetimeSteps()
  // }

  // const startWalk = async () => {
  //   await userSteps.startStepCounter(setDailySteps);
  // } 
  
  // const stopWalk = async () => {
  //   await userSteps.stopStepCounter();  
  // } 

  // const displaySteps = async () => {
  //   const stepData = await userSteps.getStepData();
  //   console.log("Step data fetched:", stepData);
  //   setDailySteps(stepData.dailySteps);
  // }

  // const settings = async () => {
  //   const appSettings = await userSettings.getAppSettings();
  //   console.log("App settings fetched:", appSettings);
  // }

  // const updateUsername = async (newUsername) => {
  //   const Settings = await userSettings.updateUsername(newUsername, setUsername);
  //   const updatedSeeting = await userSettings.getAppSettings();

  //   console.log("Updated username:", updatedSeeting.username);
  // }
 
  // useEffect(() => { 
  //   const setUpApp = async () => {
  //     await dataInit.Innitialiser();  

  //     const stepData = await dataInit.getStoredData();

  //     console.log("Step data fetched:", stepData.stats);
      
  //   }
  //   setUpApp(); 
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={{ color: '#ffffff' }}>Daily Steps: {dailySteps}</Text> 
      <Button title='Reset Lifetime Data' onPress={resetLifetimeData} />
      <Button title='Start Walking' onPress={startWalk} />
      <Button title='Stop Walking' onPress={stopWalk} />
      <Text style={{ color: '#ffffff' }}>Daily Steps: {dailySteps}</Text>

      <Text style={{color: 'fff'}}>App Settings</Text>
      <Button title='Fetch App Settings' onPress={settings} /> */}

      <Text style={{ color: '#ffffff' }}>plain APP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
