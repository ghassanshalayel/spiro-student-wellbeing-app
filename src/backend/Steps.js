import { getStoredData, saveData } from "./Innitialiser";
import { Pedometer } from 'expo-sensors';

async function startStepCounter(updateSteps) {
  const isAvailable = await Pedometer.isAvailableAsync();
  
  if (!isAvailable) {
    console.log("Pedometer not available on this device");
    return null;
  }

  // had issues for counter 
  // 20 steps walked -> app thought 400 steps 
  let previousSteps = 0;
  
  const subscription = Pedometer.watchStepCount(result => {
    let newSteps = result.steps;
    let diff = newSteps - previousSteps; 
    
    updateSteps(prevSteps => prevSteps + diff); 
  
    // Update the steps in the data file
    getStoredData().then(data => {
      if (data) {
        data.stats.dailySteps += diff;
        data.stats.lifetimeSteps += diff;
        data.stats.weeklySteps += diff;
        saveData(data);
      }
    });

    previousSteps = newSteps; 

  });
  
  return subscription; 
}


export {startStepCounter};
