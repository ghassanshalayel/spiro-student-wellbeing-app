// this is where we make Geo notes and do geolocation stuff
import * as Location from 'expo-location';
import { geSavedData, saveData } from './Initialiser';

/**
 * Gets a list of Notes with geolocation data attached to them
 * @returns JSON for of Data
 */
async function getGeoNotes() {
  const data = await geSavedData();
  return data ? data.geoNotes : [];
}

/**
 * Saves a new Geo Note with geolocation data
 * 
 * @param {String} noteTitle name of the node
 * @param {String} noteContent content of the note
 * @returns true if saves successfully, false if not
 */
async function saveGeoNote(noteTitle, noteContent) {
  const locationData = await getUsersLocation();
  const data = await getGeoNotes();

  if (locationData) {
    const { latitude, longitude } = locationData;
    
    const newData = {
      id: "Note_"+Date.now().toString(),
      title: noteTitle,
      notes: noteContent,
      timestamp: new Date().toISOString(),
      location: {
        lat: latitude,
        long: longitude
      }
    }

    // sve it to json
    data.geoNotes.push(newData);
    
    return await saveData(data);
  }
}

async function deleteGeoNote(noteId) {
  const data = await getGeoNotes();

  // no idea what to do next
}

/**
 * Gets user location, but it'll ask the user to grant permision first
 * @returns Cordinates of the current position or null if declines (VPN doesnt work lol maybe im dumb)
 */
async function getUsersLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }
  
  let { coords } = await Location.getCurrentPositionAsync();

  if (coords) {
    const { latitude, longitude } = coords;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    return { latitude, longitude };
  }
}

export { getGeoNotes, deleteGeoNote, saveGeoNote };