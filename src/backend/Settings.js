import { getStoredData, saveData, Innitialiser } from "./Initialiser";

const DEFAULT_SETTINGS = {
  username: "User",
  age: 0,
  difficulty: "Beginner",
  dailyStepGoal: 5000,
  theme: "Light",
};

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "GOD MODE"];
const THEMES = ["Light", "Dark"];
const TEMPRATURE_UNITS = ["Celsius", "Fahrenheit"];

async function loadData() {
  const data = await getStoredData();
  if (data && typeof data === "object") return data;
  return await Innitialiser();
}

function normaliseSettings(settings = {}) {
  return {
    username:
      typeof settings.username === "string" && settings.username.trim().length > 0
        ? settings.username.trim()
        : DEFAULT_SETTINGS.username,

    age:
      typeof settings.age === "number" && !Number.isNaN(settings.age)
        ? settings.age
        : DEFAULT_SETTINGS.age,

    difficulty: DIFFICULTIES.includes(settings.difficulty)
      ? settings.difficulty
      : DEFAULT_SETTINGS.difficulty,

    dailyStepGoal:
      typeof settings.dailyStepGoal === "number" &&
      Number.isInteger(settings.dailyStepGoal) &&
      settings.dailyStepGoal >= 1000 &&
      settings.dailyStepGoal <= 100000
        ? settings.dailyStepGoal
        : DEFAULT_SETTINGS.dailyStepGoal,

    theme: THEMES.includes(settings.theme)
      ? settings.theme
      : DEFAULT_SETTINGS.theme,

    temperatureUnit: TEMPRATURE_UNITS.includes(settings.temperatureUnit)
      ? settings.temperatureUnit
      : "Celsius",
  };
}

/*********** Reading *************/

async function getAppSettings() {
  const data = await loadData();

  if (!data.settings) {
    data.settings = { ...DEFAULT_SETTINGS };
    await saveData(data);
    return data.settings;
  }

  data.settings = normaliseSettings(data.settings);
  await saveData(data);
  return data.settings;
}

/*********** Updating *************/

async function updateUsername(newUsername, functionToUpdateUsername) {
  if (typeof newUsername !== "string") {
    console.log("Username must be a string.");
    return false;
  }

  const parsedUsername = newUsername.trim();

  if (parsedUsername.length === 0 || parsedUsername.length > 20) {
    console.log("Username cannot be empty or more than 20 characters.");
    return false;
  }

  const data = await loadData();
  data.settings = normaliseSettings(data.settings);

  data.settings.username = parsedUsername;
  const success = await saveData(data);

  if (!success) {
    console.log("Failed to update username.");
    return false;
  }

  if (functionToUpdateUsername) functionToUpdateUsername(parsedUsername);
  return true;
}

async function updateAge(newAge, functionToUpdateAge) {
  const parsedAge = Number(newAge);

  if (Number.isNaN(parsedAge)) {
    console.log("Age must be a number.");
    return false;
  }

  if (parsedAge < 0 || parsedAge > 100) {
    console.log("Age must be between 0 and 100.");
    return false;
  }

  const data = await loadData();
  data.settings = normaliseSettings(data.settings);

  data.settings.age = parsedAge;
  const success = await saveData(data);

  if (!success) {
    console.log("Failed to update age.");
    return false;
  }

  if (functionToUpdateAge) functionToUpdateAge(parsedAge);
  return true;
}

async function updateDifficulty(newDifficulty, functionToUpdateDifficulty) {
  if (!DIFFICULTIES.includes(newDifficulty)) {
    console.log("Invalid difficulty level.");
    return false;
  }

  const data = await loadData();
  data.settings = normaliseSettings(data.settings);

  data.settings.difficulty = newDifficulty;
  const success = await saveData(data);

  if (!success) {
    console.log("Failed to update difficulty.");
    return false;
  }

  if (functionToUpdateDifficulty) functionToUpdateDifficulty(newDifficulty);
  return true;
}

async function updateDailyStepGoal(newGoal, functionToUpdateDailyStepGoal) {
  const parsedGoal = Number(newGoal);

  if (Number.isNaN(parsedGoal) || parsedGoal < 1000 || parsedGoal > 100000) {
    console.log("Daily step goal must be between 1000 and 100000.");
    return false;
  }

  const data = await loadData();
  data.settings = normaliseSettings(data.settings);

  data.settings.dailyStepGoal = parsedGoal;
  const success = await saveData(data);

  if (!success) {
    console.log("Failed to update daily step goal.");
    return false;
  }

  if (functionToUpdateDailyStepGoal) functionToUpdateDailyStepGoal(parsedGoal);
  return true;
}

async function updateTheme(newTheme, functionToUpdateTheme) {
  if (!THEMES.includes(newTheme)) {
    console.log("Invalid theme.");
    return false;
  }

  const data = await loadData();
  data.settings = normaliseSettings(data.settings);

  data.settings.theme = newTheme;
  const success = await saveData(data);

  if (!success) {
    console.log("Failed to update theme.");
    return false;
  }

  if (functionToUpdateTheme) functionToUpdateTheme(newTheme);
  return true;
}

async function updateTemperatureUnit(newUnit, functionToUpdateTemperatureUnit) {
  if (!TEMPRATURE_UNITS.includes(newUnit)) {
    console.log("Invalid temperature unit.");
    return false;
  }

  const data = await loadData();
  data.settings = normaliseSettings(data.settings);

  data.settings.temperatureUnit = newUnit;
  const success = await saveData(data);

  if (!success) {
    console.log("Failed to update temperature unit.");
    return false;
  }

  if (functionToUpdateTemperatureUnit) functionToUpdateTemperatureUnit(newUnit);
  return true;
}

export {
  getAppSettings,
  updateUsername,
  updateAge,
  updateDifficulty,
  updateDailyStepGoal,
  updateTheme,
  updateTemperatureUnit,
  DIFFICULTIES,
  THEMES,
  TEMPRATURE_UNITS,
};