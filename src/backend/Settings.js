import { getStoredData, saveData } from "./Innitialiser";

// NOTE - comment out the cONSOLE.LOGs once submitting the code 

/*********** The Reading Functions *************/

async function getAppSettings() {
  const data = await getStoredData();

  if (!data?.settings){
    console.log("Failed to get app settings: No settings found in data.");
    return {};
  }

  // returns all the values of settings rathere than having to call each one seperately
  return {
    username: data.settings.username || "User",
    age: data.settings.age || 0,
    difficulty: data.settings.difficulty || "Beginner",
    dailyStepGoal: data.settings.dailyStepGoal || 5000,
    theme: data.settings.theme || "Light"
  };
}



/*********** The Updating Functions  *************/
// (new Value to update, Updating on UI) <- param goes by

async function updateUsername(newUsername, functionToUpdateUsername) {
  
  if (typeof newUsername !== "string"){
    console.log("Username must be a string.");
    return false;
  } 

  newUsername = newUsername.trim();

  if (newUsername.length === 0 || newUsername.length > 20) {
    console.log("Username cannot be empty. Also canot be more than 20 chars");
    return false;
  }


  const data = await getStoredData();
  if (!data?.settings){
    console.log("Failed to update username: No settings found in data.");
    return false;
  }

  data.settings.username = newUsername;
  const success = await saveData(data);

  if (!success){
    console.log("Failed to update username.");
    return false;
  }

  functionToUpdateUsername(newUsername);
  console.log("Username updated successfully to:", newUsername);

  return true;
}


async function updateAge(newAge, functionToUpdateAge) {

  if (Number.isNaN(newAge)) {
    console.log("Age must be a number.");
    return false;
  }

  if (newAge < 0 || newAge > 100) {
    console.log("Fr ddude, your age is less than 0 or more than 100, nah enter a valid age");
    return false;
  }

  const data = await getStoredData();
  
  if (!data?.settings){
    console.log("Failed to update age: No settings found in data.");
    return false;
  }

  data.settings.age = Number(newAge); 
  const success = await saveData(data);

  if (!success){
    console.log("Failed to update age.");
    return false;
  }

  functionToUpdateAge(newAge);
  console.log("Age updated successfully to:", newAge);
  return true;

}


async function updateDifficulty(newDifficulty, functionToUpdateDifficulty) {
  const difficultyAvailability = ["Beginner", "Intermediate", "Advanced", "GOD MODE"];

  if (difficultyAvailability.indexOf(newDifficulty) === -1){
    console.log("Invalid difficulty level.");
    return false;
  }

  const data = await getStoredData();

  if (!data?.settings){
    console.log("Failed to update difficulty: No settings found in data.");
    return false;
  }

  data.settings.difficulty = newDifficulty;
  const success = await saveData(data);

  if (!success){
    console.log("Failed to update difficulty.");
    return false;
  }

  functionToUpdateDifficulty(newDifficulty);
  console.log("Difficulty updated successfully to:", newDifficulty);
  return true;
}

async function updateDailyStepGoal(newGoal, functionToUpdateDailyStepGoal) {

  if (Number.isNaN(newGoal) || newGoal < 1000 || newGoal > 100000) {
    console.log("If ur going more than 100000 ur insane dude, if lower than 1000, GET UP AND WALK 5000 STEPS");
    return false;
  }

  const data = await getStoredData();

  if (!data?.settings){
    console.log("Failed to update daily step goal: No settings found in data.");
    return false;
  }

  data.settings.dailyStepGoal = newGoal;
  const success = await saveData(data);

  if (!success){
    console.log("Failed to update daily step goal.");
    return false;
  }

  functionToUpdateDailyStepGoal(newGoal);
  console.log("Daily step goal updated successfully to:", newGoal);
  return true;

}

async function updateTheme(newTheme, functionToUpdateTheme) {
  const themeAvailability = ["Light", "Dark"];

  if (themeAvailability.indexOf(newTheme) === -1){
    console.log("Invalid theme.");
    return false;
  }

  const data = await getStoredData();

  if (!data?.settings){
    console.log("Failed to update theme: No settings found in data.");
    return false;
  }

  data.settings.theme = newTheme;
  const success = await saveData(data);

  if (!success){
    console.log("Failed to update theme.");
    return false;
  }

  functionToUpdateTheme(newTheme);
  console.log("Theme updated successfully to:", newTheme);
  return true;
}


export { 
  getAppSettings, 
  updateUsername, 
  updateAge, 
  updateDifficulty, 
  updateDailyStepGoal, 
  updateTheme 
};