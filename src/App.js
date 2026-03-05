import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getStoredData } from './backend/Innitialiser';
import { startStepCounter } from './backend/Steps';

export default function App() {
  // const [steps, setSteps] = useState(0); // Initialize with stored daily steps or 0

  // useEffect(() => {
  //   let subscription;

  //   async function test() {
  //     subscription = await startStepCounter(setSteps);

  //     const data = await getStoredData();
  //     console.log("Data Initailsed:", data.stats);
  //   }
  //   test(); 

  //   // preventing the mem leak, so that wrong data to be not inserted 
  //   return () => {
  //     if (subscription) subscription.remove(); 
  //   }; 
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={{ color: '#ffffff' }}>Empty App</Text>
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
