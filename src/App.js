import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getStoredData } from './backend/Innitialiser';
import { startStepCounter } from './backend/Steps';

export default function App() {

  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription;

    async function initSteps() {
      subscription = await startStepCounter((newCount) => {
        setSteps(newCount); 
      });
    }

    // async function test() {
    //   const data = await getStoredData();
    //   console.log("Data Initailsed:", data.stats);
    // }
    // test(); 
    initSteps(); 

    // CLEANUP: Stop the sensor when Johnny leaves the screen
    return () => {
      if (subscription) subscription.remove();
    }; 
  }, []);

  return (
    <View style={styles.container}>
      <Text>Steps: {steps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
