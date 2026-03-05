import * as fileSys from 'expo-file-system/legacy';


//  the default dtata if the file is not initialised
const DEFAULT_DATA = {
  settings: {
    username: "User",  // can be set by user
    Age: 25,           // can be set by user
    difficulty: "Beginner",
    dailyStepGoal: 5000,
    theme: "Light"
  },
  stats: {
    lifetimeSteps: 0,
    weeklySteps: 0,
    dailySteps: 0,
    level: 1,
    currentXp: 0
  },
  pet: {
    name: "",  // can be set by user
    stage: "Egg", 
    happiness: 100,
    lastUpdate: new Date().toISOString()
  },
  geoNotes: [],
  natureGallery: []
};

async function Innitialiser() {
  try{

    const fileURI = fileSys.documentDirectory + 'appData.json';
    const fileInfo = await fileSys.getInfoAsync(fileURI); // get the file info for checking if it exists or not

    // if the file doesnt exists the initialise with default data 
    if (!fileInfo.exists) {
      await fileSys.writeAsStringAsync(fileURI, JSON.stringify(DEFAULT_DATA));
      return DEFAULT_DATA; 
    }
  }

  catch (error) {
    console.error("Error initializing app data:", error);
    return DEFAULT_DATA; // rollback to default if any data corruption
  }
}

async function getStoredData() {
  try {
    const fileURI = fileSys.documentDirectory + 'appData.json';
    const fileContent = await fileSys.readAsStringAsync(fileURI);
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error getting stored data:", error);
    return DEFAULT_DATA;
  }
}

async function saveData(newData) {
  try{
    const fileURI = fileSys.documentDirectory + 'appData.json';
    await fileSys.writeAsStringAsync(fileURI, JSON.stringify(newData));
    return true; 

  }
  catch (error) {
    console.error("Error saving app data:", error);
    return false; // indicate failure to save
  }
}


export {Innitialiser, saveData, getStoredData};