import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getGallery, savePhoto, deletePhoto } from '../backend/Gallery';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    const data = await getGallery();
    setPhotos(data);
  }

  async function handleTakePhoto() {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      Alert.alert('Permission needed', 'Camera access is required to take photos.');
      return;
    }

    const locationPermission = await Location.requestForegroundPermissionsAsync();
    if (!locationPermission.granted) {
      Alert.alert('Permission needed', 'Location access is required to tag your photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (result.canceled) return;

    const loc = await Location.getCurrentPositionAsync({});
    const location = {
      lat: loc.coords.latitude,
      lng: loc.coords.longitude
    };

    const uri = result.assets[0].uri;
    const title = `Photo ${Date.now()}`;

    await savePhoto(uri, title, location);
    await loadGallery();
  }

  async function handleDelete(id) {
    Alert.alert('Delete Photo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deletePhoto(id);
          await loadGallery();
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Nature Gallery</Text>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.photoCard}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text style={styles.photoTitle}>{item.title}</Text>
            <Text style={styles.photoDate}>{item.date}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.captureBtn} onPress={handleTakePhoto}>
        <Text style={styles.captureBtnText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  photoCard: { flex: 1, margin: 5, alignItems: 'center' },
  image: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  photoTitle: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  photoDate: { fontSize: 10, color: '#888' },
  deleteBtn: { color: 'red', fontSize: 12, marginTop: 4 },
  captureBtn: {
    backgroundColor: '#4CAF50', padding: 15,
    borderRadius: 10, alignItems: 'center', margin: 10
  },
  captureBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});