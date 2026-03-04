# Mindful Miles: Student Destresser App
### CS317 Group Project 

## Project Overview
Mindful Miles is a mobile health application designed to help students like "Johnny" manage exam stress. The app gamifies physical activity by linking real-world steps to the growth and happiness of a virtual pet. It is built on the 5 Ways to Wellbeing:

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
MindfulMiles/
├── assets/                     <-- file images 
├── src/
│   ├── backend/
│   │   ├── DataInitialize.js   <-- JSON load/save logic
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
    "Age": 25,           // can be set by user
    "difficulty": "Intermediate",
    "dailyStepGoal": 5000,
    "theme": "Light"
  },
  "stats": {
    "lifetimeSteps": 0,
    "weeklySteps": 0,
    "dailySteps": 0,
    "level": 1,
    "currentXp": 0
  },
  "pet": {
    "name": "Buddy",
    "stage": "Egg",
    "happiness": 100,
    "lastUpdate": "2026-03-03T19:00:00Z"
  },
  "geoNotes": [],
  "natureGallery": []
}
```