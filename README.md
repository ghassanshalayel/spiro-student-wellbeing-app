# Spiro: Student Destresser App
### CS317 Group Project 

## Project Overview
Spiro is a mobile health application designed to help students like "Johnny" manage exam stress. The app gamifies physical activity by linking real-world steps to the growth and happiness of a virtual pet. It is built on the 5 Ways to Wellbeing:

***Be Active***: Pedometer-based step tracking.

***Take Notice***: Location-based mindfulness prompts.

***Connect/Give/Learn***: Community-driven "Geo-Notes" and nature challenges.

## Our Persona: Johnny (The Stressed Student)
***Status***: 3rd-year CS student.

***Problem***: High stress, sedentary lifestyle due to exams.

***Goal***: Needs a reason to take a break and walk.

***App Benefit***: Buddy (the pet) gets sad if Johnny doesn't walk, providing external motivation to destress.

## File Structure
```bash
Spiro/
├── assets/                     <-- file images 
├── src/
│   ├── backend/
│   │   ├── Initialiser.js      <-- JSON load/save logic
│   │   ├── Settings.js         <-- User Settings
│   │   ├── Steps.js            <-- Step counter functions 
│   │   
│   ├── screens/                <-- the display screens  (needs to be implemented)
```

## How we store the Local Data?

we store the data in JSON format

in future, new values can be added or be removed

### The Schema
```JSON 
{
  "settings": {
    "username": "User",  // can be set by user
    "age": 25,           // can be set by user
    "difficulty": "Intermediate",
    "dailyStepGoal": 5000,
    "theme": "Light"
  },
  "stats": {
    "lifetimeSteps": 0,
    "weeklySteps": 0,
    "dailySteps": 0,
    "level": 1,
    "currentXp": 0,
    "lastUpdatedDay": "2026-03-05",  // for daily updates
    "lastUpdatedWeek": "2026-03-05", // for weekly updates
  },
  "pet": {
    "name": "Buddy",
    "stage": "Egg",
    "happiness": 100,
    "lastUpdate": "2026-03-03"
  },
  "geoNotes": [  // thses stay empty if thers a new user
    {
      "id": "note_1741197600",
      "title": "Riverside Reflection",
      "notes": "The water is very calm today. Great spot for a 5-minute breather.",
      "latitude": 55.8642,
      "longitude": -4.2518,
      "timestamp": "2026-03-05T18:00:00Z"
    }
  ],
  "natureGallery": [
    {
      "id": "img_001",
      "uri": "Filepath of moblie appData/Olk_Tree.jpg",
      "title": "Old Oak Tree",
      "date": "2026-03-05",
      "location": {
        "lat": 0.417,
        "log": 2.5638
      }
    }
  ]
}
```