import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

import { getStoredData } from '../backend/Initialiser';
import { saveGeoNote, deleteGeoNote } from '../backend/GeoNotes'; 
import { deletePhoto } from '../backend/Gallery'; 

export default function MapScreen() {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  
  // local states for visibility and the text inputs
  const [modalVisible, setModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // useFocusEffect is better here than useEffect because it reloads data every time the screen is active again 
  useFocusEffect(
    useCallback(() => {
      loadMapData();
    }, [])
  );

  async function loadMapData() {
    const data = await getStoredData();
    let loadedMarkers = [];
    
    // creating a set to track coords already used to prevent overlapping pins
    const usedCoordinates = new Set();
    const spacing = 0.0006; 

    // this function creates a tiny random offset if two pins share the exact same spot so they both stay clickable
    function getJitteredCoords(lat, lng) {
      let newLat = lat;
      let newLng = lng;
      let key = `${newLat},${newLng}`;
      
      // if the key is already in the set we shift the position a little bit until its unique
      while (usedCoordinates.has(key)) {
        newLat = lat + (Math.random() - 0.5) * spacing;
        newLng = lng + (Math.random() - 0.5) * spacing;
        key = `${newLat},${newLng}`;
      }
      
      usedCoordinates.add(key);
      return { latitude: newLat, longitude: newLng };
    }

    if (data?.geoNotes) {
      const notes = data.geoNotes.map(note => {
        // checking different naming conventions for longitude across the json files just in case
        const rawLat = note.location?.lat || 0;
        const rawLng = note.location?.long || note.location?.lng || note.location?.log || 0;
        const safeCoords = getJitteredCoords(rawLat, rawLng);

        return {
          id: note.id,
          type: 'note',
          title: note.title,
          description: note.notes,
          latitude: safeCoords.latitude,
          longitude: safeCoords.longitude, 
        };
      });
      loadedMarkers = [...loadedMarkers, ...notes];
    }

    // parsing the gallery photos from storage to show as green markers
    if (data?.natureGallery) {
      const photos = data.natureGallery.map(photo => {
        const rawLat = photo.location?.lat || 0;
        const rawLng = photo.location?.long || photo.location?.lng || photo.location?.log || 0;
        const safeCoords = getJitteredCoords(rawLat, rawLng);

        return {
          id: photo.id,
          type: 'photo',
          title: photo.title,
          description: "Captured on " + photo.date,
          uri: photo.uri,
          latitude: safeCoords.latitude,
          longitude: safeCoords.longitude,
        };
      });
      loadedMarkers = [...loadedMarkers, ...photos];
    }

    setMarkers(loadedMarkers);
  }

  // initial setup for permissions and centering the map on the user once at startup
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      try {
        // accuracy balanced is usually faster and enough for the initial zoom
        let initialLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        
      
        mapRef.current?.animateToRegion({
          latitude: initialLoc.coords.latitude,
          longitude: initialLoc.coords.longitude,
          latitudeDelta: 0.01, 
          longitudeDelta: 0.01,
        }, 1000); 
      } catch (error) {
        console.log("failed to get start location", error);
      }
    })();
  }, []);

  // saving the geonote to the backend and refreshing the map view after
  async function handleDropNote() {
    if (!noteTitle.trim() || !noteContent.trim()) {
      Alert.alert("Missing Info", "Please enter both a title and some thoughts for your note.");
      return;
    }

    setIsSaving(true);
    
    try {
      const success = await saveGeoNote(noteTitle, noteContent);
      
      if (success) {
        setNoteTitle('');
        setNoteContent('');
        setModalVisible(false);
        loadMapData(); // reload pins to show the new one immediately
      } else {
        Alert.alert("Error", "Could not drop your note. Make sure your location permissions are granted.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong saving your note.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  // logic for the alert pop up when a user clicks a pin bubble to remove it
  function handleCalloutPress(marker) {
    Alert.alert(
      "Manage Pin",
      `Would you like to delete "${marker.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            if (marker.type === 'note') {
              await deleteGeoNote(marker.id);
            } else if (marker.type === 'photo') {
              await deletePhoto(marker.id);
            }
            loadMapData(); 
          } 
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true} 
      >
        {/* looping through markers and making it  blue for notes and green for photos */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            pinColor={marker.type === 'note' ? 'blue' : 'green'}
          >

            <Callout tooltip onPress={() => handleCalloutPress(marker)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                
                {marker.type === 'note' ? (
                  <Text style={styles.calloutText}>{marker.description}</Text>
                ) : (
                  <View style={styles.calloutImageContainer}>
                    <Image 
                      source={{ uri: marker.uri }} 
                      style={styles.calloutImage} 
                      resizeMode="cover"
                    />
                    <Text style={styles.photoDateText}>{marker.description}</Text>
                  </View>
                )}
                
                <Text style={styles.deleteHintText}>Tap to manage</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* the drop note button floating over the map */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>✍️</Text>
        <Text style={styles.fabText}>Drop Note</Text>
      </Pressable>

      {/* modal view for adding new notes with overlay background */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Leave a Geo-Note</Text>
            <Text style={styles.modalSub}>Share your thoughts!</Text>

            <TextInput
              style={styles.input}
              placeholder="Note Title"
              value={noteTitle}
              onChangeText={setNoteTitle}
              maxLength={30}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's on your mind? Did you see something nice?"
              value={noteContent}
              onChangeText={setNoteContent}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.buttonRow}>
              <Pressable 
                style={[styles.btn, styles.cancelBtn]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.btn, styles.saveBtn]} 
                onPress={handleDropNote}
                disabled={isSaving}
              >
                {/* showing a spinner while the file is being written to disk */}
                {isSaving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Drop Pin</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  
  calloutContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: 220,
    borderColor: '#CBD5E1', 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: '#3567B7' },
  calloutText: { fontSize: 14, color: '#475569' },
  calloutImageContainer: { alignItems: 'center', marginTop: 4 },
  calloutImage: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#E2E8F0', 
  },
  photoDateText: { fontSize: 12, color: '#64748B', fontStyle: 'italic' },
  deleteHintText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#3567B7', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabIcon: { fontSize: 18, marginRight: 6 },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  modalSub: { fontSize: 14, color: '#475569', marginBottom: 20 },
  
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  textArea: { height: 100 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#F1F5F9', marginRight: 10 },
  cancelBtnText: { color: '#475569', fontWeight: 'bold', fontSize: 16 },
  saveBtn: { backgroundColor: '#3567B7', marginLeft: 10 },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});