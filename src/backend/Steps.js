import { getStoredData, saveData } from "./Initialiser";
import { Pedometer } from 'expo-sensors';
import { normalisePetData, applyStepsReward } from "./Pet";

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

let subscriptionActive = null;
let trackerStarted = false;

async function startStepCounter(updateSteps) {
  const isAvailable = await Pedometer.isAvailableAsync();

  if (!isAvailable) return null;

  // we dont want any previous trackers to be sent so remove them
  stopStepCounter(); 

  trackerStarted = true;
  if (subscriptionActive) return subscriptionActive;
  
  let previousSteps = 0;
  
  subscriptionActive = Pedometer.watchStepCount(async result => {

    // we dont wanna add steps if the tracker is not active
    if (!trackerStarted) return; 

    console.log("Counter Successfully started");

    const newSteps = result.steps;
    const diff = newSteps - previousSteps;

    if (diff < 0) return;

    // UI update
    updateSteps(prev => prev + diff);
    previousSteps = newSteps;

    // update the data
    const data = await getStoredData();

    if (data?.stats) {
      normalisePetData(data);
      data.stats.dailySteps += diff;
      data.stats.weeklySteps += diff;
      data.stats.lifetimeSteps += diff;

      applyStepsReward(data, diff);

      await saveData(data);
    }

    // console.log("===== DEBUG: Step Count Updated =====");
    // console.log("Steps added:", diff, "| Running total:", previousSteps);
    // console.log("=====================================");

  });
  
  return subscriptionActive; 
}

async function stopStepCounter() {
  trackerStarted = false;

  if (subscriptionActive) {
      subscriptionActive.remove();
      subscriptionActive = null;

      console.log("Step counter stopped.");
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
