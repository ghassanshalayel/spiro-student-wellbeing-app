import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Alert, Modal, Pressable, Dimensions, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getGallery, savePhoto, deletePhoto } from '../backend/Gallery';
import { getStoredData } from '../backend/Initialiser';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const THEMES = {
  Light: {
    pageBg: '#E8EEF9',
    cardBg: '#FFFFFF',
    text: '#1E293B',
    subText: '#475569',
    border: '#CBD5E1',
    primaryBtn: '#3567B7',
    primaryBtnBorder: '#2E5BA3',
    primaryBtnText: '#FFFFFF',
    badgeBg: '#F2C94C',
    badgeBorder: '#D4A72C',
    iconDark: '#111827',
    emptyText: '#94A3B8',
  },
  Dark: {
    pageBg: '#0F172A',
    cardBg: '#1E293B',
    text: '#F8FAFC',
    subText: '#CBD5E1',
    border: '#334155',
    primaryBtn: '#60A5FA',
    primaryBtnBorder: '#3B82F6',
    primaryBtnText: '#0F172A',
    badgeBg: '#FACC15',
    badgeBorder: '#EAB308',
    iconDark: '#0F172A',
    emptyText: '#475569',
  },
};

const COLUMN_COUNT = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PHOTO_SIZE = (SCREEN_WIDTH - 36) / COLUMN_COUNT;

export default function GalleryScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [theme, setTheme] = useState(THEMES.Light);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  async function loadAll() {
    const [data, appData] = await Promise.all([getGallery(), getStoredData()]);
    setPhotos(data);
    const themeName = appData?.settings?.theme === 'Dark' ? 'Dark' : 'Light';
    setTheme(THEMES[themeName]);
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
    const location = { lat: loc.coords.latitude, lng: loc.coords.longitude };
    const uri = result.assets[0].uri;
    const title = `Photo ${new Date().toLocaleDateString()}`;

    await savePhoto(uri, title, location);
    await loadAll();
  }

  function openMenu(photo) {
    setSelectedPhoto(photo);
    setMenuVisible(true);
  }

  function closeMenu() {
    setMenuVisible(false);
    setSelectedPhoto(null);
  }

  function handleShowLocation() {
    closeMenu();
    navigation.navigate('Map', {
      lat: selectedPhoto.location.lat,
      lng: selectedPhoto.location.lng,
    });
  }

  function handleDeletePrompt() {
    closeMenu();
    Alert.alert('Delete Photo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deletePhoto(selectedPhoto.id);
          await loadAll();
        }
      }
    ]);
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.pageBg }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backBtn, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
      >
        <Text style={[styles.backBtnText, { color: theme.text }]}>←</Text>
      </TouchableOpacity>

      {/* Stats bar */}
      <View style={[styles.statsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>{photos.length}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Photos</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {[...new Set(photos.map(p => p.date))].length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Days</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {photos.filter(p => p.location?.lat).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Tagged</Text>
          </View>
        </View>
      </View>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📷</Text>
          <Text style={[styles.emptyText, { color: theme.emptyText }]}>
            No photos yet. Take your first one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={[styles.photoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => openMenu(item)}
              >
                <Text style={styles.menuDots}>⋮</Text>
              </TouchableOpacity>
              <Text style={[styles.photoDate, { color: theme.subText }]}>{item.date}</Text>
            </View>
          )}
        />
      )}

      {/* Take photo button */}
      <TouchableOpacity
        style={[styles.captureBtn, { backgroundColor: theme.primaryBtn, borderColor: theme.primaryBtnBorder }]}
        onPress={handleTakePhoto}
      >
        <Text style={[styles.captureBtnText, { color: theme.primaryBtnText }]}>+ Take Photo</Text>
      </TouchableOpacity>

      {/* 3 dots modal */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <View style={[styles.menuContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleShowLocation}>
              <Text style={[styles.menuItemText, { color: theme.text }]}>📍 Show Location</Text>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
            <TouchableOpacity style={styles.menuItem} onPress={handleDeletePrompt}>
              <Text style={[styles.menuItemText, { color: 'red' }]}> Delete Photo</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 48, paddingHorizontal: 18, paddingBottom: 18 },
  title: { fontSize: 34, fontWeight: '700', textAlign: 'center', marginBottom: 12 },

  statsCard: {
    borderRadius: 18, padding: 14, borderWidth: 2, marginBottom: 14,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 36 },

  grid: { paddingBottom: 12 },
  photoCard: {
    width: PHOTO_SIZE, margin: 3,
    borderRadius: 12, overflow: 'hidden', borderWidth: 2,
  },
  image: { width: PHOTO_SIZE, height: PHOTO_SIZE },
  menuBtn: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12, width: 26, height: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  menuDots: { color: '#fff', fontSize: 18, lineHeight: 22 },
  photoDate: { fontSize: 10, fontWeight: '600', padding: 4 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },

  captureBtn: {
    minHeight: 52, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginTop: 8, borderWidth: 2,
  },
  captureBtnText: { fontSize: 17, fontWeight: '800' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  menuContainer: {
    borderRadius: 16, width: 230,
    paddingVertical: 8, borderWidth: 2,
  },
  menuItem: { paddingVertical: 14, paddingHorizontal: 20 },
  menuItemText: { fontSize: 15, fontWeight: '600' },
  menuDivider: { height: 1, marginHorizontal: 10 },

  backBtn: {
    alignSelf: 'flex-start', 
    borderWidth: 2,
    borderRadius: 12, 
    paddingVertical: 8,
    paddingHorizontal: 14, 
    marginBottom: 12,
  },
  backBtnText: { fontSize: 15, fontWeight: '700' },
});