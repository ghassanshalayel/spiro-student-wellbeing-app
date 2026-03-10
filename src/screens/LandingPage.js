import React, { use, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default function LandingPage({ navigation }) {


  return (
    <View style={styles.container}>
      <Text>Welcome to Spiro</Text>
      <Button 
        title="Open Map" 
        onPress={() => navigation.navigate('Map')} 
      />
      <Button 
        title="View Gallery" 
        onPress={() => navigation.navigate('Gallery')} 
      />
      <Button 
        title="Settings" 
        onPress={() => navigation.navigate('Settings')} 
      />
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