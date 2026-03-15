import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;


      // It updates every time you move more than 5 meters
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Update every 5 meters
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          
          // Smoothly move the camera to follow the user
          mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000); 
        }
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map}
        //Makes a dot and follows user
        showsUserLocation={true} 
        followsUserLocation={true} 
      >
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});
