import { getStoredData, saveData } from "./Innitialiser";
import { Pedometer } from 'expo-sensors';

async function startStepCounter(updateSteps) {
  const isAvailable = await Pedometer.isAvailableAsync();
  
  if (!isAvailable) {
    console.log("Pedometer not available on this device");
    return null;
  }

  let previousSteps = 0;
  
  // Subscribe to step count updates
  const subscription = Pedometer.watchStepCount(result => {
    let newSteps = result.steps;
    
    updateSteps(newSteps); // Update the steps in the app state
  
    // Update the steps in the data file
    getStoredData().then(data => {
      if (data) {
        data.stats.dailySteps += newSteps;
        data.stats.lifetimeSteps += newSteps;
        data.stats.weeklySteps += newSteps;
        saveData(data);
      }
    });
  });
  
  return subscription; // Return subscription for cleanup
}



export {startStepCounter};
