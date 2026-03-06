import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getStoredData, resetData } from './backend/Initialiser';
import { startStepCounter } from './backend/Steps';

export default function App() {
  // const [steps, setSteps] = useState(0); // Initialize with stored daily steps or 0
  // const [dailySteps, setDailySteps] = useState(0);

  // useEffect(() => {  
  //   let subscription;

  //   async function test() {
  //     subscription = await startStepCounter(setSteps);

  //     const data = await getStoredData();
  //     console.log("Fetched Stored Data:", data.stats);

  //     if (data) {
  //       setDailySteps(data.stats.dailySteps); // Initialize with stored daily steps
  //     }

  //     // console.log("\n===== DEBUG: Steps State Updated =====");
  //     // console.log("Current Steps State:", steps);
  //     // console.log("Current Daily Steps State:", dailySteps);
  //     // console.log("Updated JSON Data:\n", data);
  //     // console.log("=====================================\n");
  //   } 
  //   test(); 
  
  //   // preventing the mem leak, so that wrong data to be not inserted 
  //   return () => { 
  //     if (subscription) subscription.remove(); 
  //   }; 
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={{ color: '#ffffff' }}>Daily Steps: {dailySteps}</Text> */}
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
