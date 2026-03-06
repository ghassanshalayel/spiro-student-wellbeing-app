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
[Click Me to see the Schema](src\example.json)