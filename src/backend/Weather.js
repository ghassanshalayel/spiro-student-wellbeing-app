// this is just for getting the weater from the API
import { getUsersLocation } from './GeoNotes';
import { getStoredData } from './Initialiser';

async function getWeatherFromCurrentLocation() {

  const currentLocation = await getUsersLocation();
  const data = await getStoredData();

  const tmpUnit = data?.settings?.temperatureUnit || "Celsius";

  if (!currentLocation) {
    console.log("Failed to get weather data: Unable to retrieve user location.");
    return null;
  }

  const { latitude, longitude } = currentLocation;

  try {
    const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_120m&temperature_unit=${tmpUnit.toLowerCase()}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export { getWeatherFromCurrentLocation as getWeatherData };