import * as Location from 'expo-location';
import { getStoredData, saveData } from './Initialiser';

/**
 * Gets a list of Notes with geolocation data attached to them
 * @returns Array of GeoNotes
 */
async function getGeoNotes() {
  const data = await getStoredData();
  return data ? data.geoNotes : [];
}

/**
 * Saves a new Geo Note with geolocation data
 * @param {String} noteTitle name of the note
 * @param {String} noteContent content of the note
 * @returns true if saves successfully, false if not
 */
async function saveGeoNote(noteTitle, noteContent) {
  try {
    const locationData = await getUsersLocation();
    
   
    if (!locationData) {
      console.log("Could not get location data. Check permissions.");
      return false; 
    }

    const data = await getStoredData(); 
    const { latitude, longitude } = locationData;
    
    const newData = {
      id: "Note_" + Date.now().toString(),
      title: noteTitle,
      notes: noteContent,
      timestamp: new Date().toISOString(),
      location: {
        lat: latitude,
        long: longitude 
      }
    }

    if (!data.geoNotes) data.geoNotes = [];
    data.geoNotes.push(newData);
    
    return await saveData(data);

  } catch (error) {
    console.error("Error saving Geo-Note:", error);
    return false; 
  }
}

/**
 * Deletes a GeoNote by ID
 * @param {String} noteId 
 */
async function deleteGeoNote(noteId) {
  try {
    const data = await getStoredData();
    if (!data || !data.geoNotes) return false;

    data.geoNotes = data.geoNotes.filter(note => note.id !== noteId);
    return await saveData(data);
  } catch (error) {
    console.error("Error deleting Geo-Note:", error);
    return false;
  }
}

/**
 * Gets user location, asking the user to grant permission first
 * @returns Coordinates of the current position or null if declined/failed
 */
async function getUsersLocation() {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }
    
    let { coords } = await Location.getCurrentPositionAsync({});

    if (coords) {
      const { latitude, longitude } = coords;
      return { latitude, longitude };
    }
    return null;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

export { getGeoNotes, deleteGeoNote, saveGeoNote, getUsersLocation };