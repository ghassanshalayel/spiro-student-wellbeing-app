import { getStoredData, saveData } from "./Initialiser";
import { Pedometer } from 'expo-sensors';

async function getStepData() {
  const data = await getStoredData();

  if (!data?.stats){
    console.log("Failed to get step data: No stats found in data.");
    return null;
  } 

  return {
    lifetimeSteps: data.stats.lifetimeSteps,
    weeklySteps: data.stats.weeklySteps,
    dailySteps: data.stats.dailySteps
  }
}


/************ Function for Starting the Counter ************/

async function startStepCounter(updateSteps) {
  const data = await getStoredData();

  const isAvailable = await Pedometer.isAvailableAsync();
  
  if (!isAvailable) {
    console.log("Pedometer not available on this device");
    return null;
  }

  // had issues for counter 
  // 20 steps walked -> app thought 400 steps 
  let previousSteps = 0;
  
  const subscription = Pedometer.watchStepCount(async result => {
    let newSteps = result.steps;
    let diff = newSteps - previousSteps; 

    if (diff <= 0) return; // no changes to do so go back 
    
    updateSteps(prevSteps => prevSteps + diff); 

    previousSteps = newSteps; 
  
    if (!data?.stats) {
      console.log("Failed to update steps: No stats found in data.");
      return;
    }

    data.stats.dailySteps += diff;
    data.stats.weeklySteps += diff;
    data.stats.lifetimeSteps += diff;
    
    const success = await saveData(data);

    if (!success) {
      console.log("Failed to update steps in data file.");
      return;
    }

    // console.log("===== DEBUG: Step Count Updated =====");
    // console.log("New Steps from Pedometer:", newSteps);
    // console.log("Previous Steps:", previousSteps);
    // console.log("Difference (Steps Added):", diff);
  
    // console.log("Updated Steps State:", previousSteps);
    // console.log("=====================================");

  });
  
  return subscription; 
}

async function stopStepCounter(subscription) {
  if (subscription) {
    subscription.remove();
    console.log("Step counter stopped successfully.");
  }
}


/************ TheReset Function fr Setp Counter ************/

async function resetDailySteps() {
  const dailyData = await getStoredData();

  if (!dailyData?.stats) {
    console.log("Failed to reset daily steps: No stats found in data.");
    return;
  }

  const lastDate = new Date(dailyData.stats.lastUpdatedDay);
  const today = new Date();

  // gets like days 1000*60*60*24 is 1 day
  let diffrence = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

  if (diffrence === 1){
    dailyData.stats.dailySteps = 0;
    dailyData.stats.lastUpdatedDay = today.toISOString().split('T')[0]; // Update the last updated day date

    await saveData(dailyData);
    console.log("Daily steps reset successfully.");
    return true;
  }

  return false;
}

// resets the counter for the week
async function resetWeeklySteps() {
  const weekData = await getStoredData();

  if (!weekData?.stats) {
    console.log("Failed to reset weekly steps: No stats found in data.");
    return;
  }

  const lastUpdatedWeek = new Date(weekData.stats.lastUpdatedWeek);
  const today = new Date();

  let diffInDays = Math.floor((today - lastUpdatedWeek) / (1000 * 60 * 60 * 24));

  if (diffInDays >= 7) {
    weekData.stats.weeklySteps = 0;
    weekData.stats.lastUpdatedWeek = today.toISOString().split('T')[0]; // Update the last updated week date

    await saveData(weekData);
    console.log("Weekly steps reset successfully.");
    return true;
  }
  return false;
}

// if and only if user wanna do it 
async function resetLifetimeSteps() {

  const lifetimeData = await getStoredData();

  if (!lifetimeData?.stats) {
    console.log("Failed to reset lifetime steps: No stats found in data.");
    return;
  };

  lifetimeData.stats.dailySteps = 0;
  lifetimeData.stats.weeklySteps = 0;
  lifetimeData.stats.lifetimeSteps = 0;

  await saveData(lifetimeData);
  console.log("Lifetime steps reset successfully.");
  return true;
}

export {getStepData,
  startStepCounter, 
  stopStepCounter,
  resetDailySteps, 
  resetWeeklySteps, 
  resetLifetimeSteps};
