import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { deleteAppData, Innitialiser } from './backend/Innitialiser';

export default function App() {


  // useEffect(() => {
  //   async function test() {
  //     const data = await Innitialiser();
  //     console.log("Data Initailsed:", data);
  //   }
  //   test();
  // }, []); 

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
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
