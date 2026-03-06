import * as fileSys from 'expo-file-system/legacy';


//  the default dtata if the file is not initialised
const DEFAULT_DATA = {
  settings: {
    username: "User",  
    age: 25,           
    difficulty: "Beginner",
    dailyStepGoal: 5000,
    theme: "Light"
  },
  stats: {
    lifetimeSteps: 0,
    weeklySteps: 0,
    dailySteps: 0,
    level: 1,
    currentXp: 0,
    lastUpdatedDay: new Date().toISOString().split('T')[0], 
    lastUpdatedWeek: new Date().toISOString().split('T')[0], 
  },
  pet: {
    name: "",  
    stage: "Egg", 
    happiness: 100,
    lastUpdated: new Date().toISOString().split('T')[0] 
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
      await saveData(DEFAULT_DATA); 
      return DEFAULT_DATA; 
    }

    // file exists, and if its corrupted 
    const fileContent = await fileSys.readAsStringAsync(fileURI);
    const data = JSON.parse(fileContent);
    
    if (!data || typeof data !== "object") {
      console.log("Courrupted Data, resetting to default");
      await saveData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }

    return data; 
  }

  catch (error) {
    console.error("Error initializing app data:", error);
    return DEFAULT_DATA; 
  }
}

async function getStoredData() {
  try {
    const fileURI = fileSys.documentDirectory + 'appData.json';
    const fileContent = await fileSys.readAsStringAsync(fileURI);
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error getting stored data:", error);
    return null;
  }
}

async function saveData(newData) {
  try{

    if (!newData || typeof newData !== "object") {
      throw new Error("Invalid data format. Data must be an object."); 
    }

    const fileURI = fileSys.documentDirectory + 'appData.json';
    await fileSys.writeAsStringAsync(fileURI, JSON.stringify(newData));
    return true; 

  }
  catch (error) {
    console.error("Error saving app data:", error);
    return false; // indicate failure to save
  }
}


// if and only if the DEV wants to reset, like us
async function resetData() {
  try {
    await saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  } catch (error) {
    console.error("Error resetting app data:", error);
    return DEFAULT_DATA;
  }
}


export {Innitialiser, saveData, getStoredData, resetData};