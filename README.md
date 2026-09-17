# Spiro – Student Wellbeing App

### CS317 Group Project | University of Strathclyde

## Overview

Spiro is a mobile wellbeing application designed to encourage students to take meaningful breaks from prolonged periods of study and become more physically active.

The app combines step tracking, a virtual pet, location-based activities and mindfulness prompts to make taking a break feel rewarding rather than disruptive.

The concept was developed around the **5 Ways to Wellbeing**, with features designed to encourage physical activity, awareness of surroundings and social interaction.

## Key Features

### Virtual Pet & Step Tracking
Spiro links the user's physical activity to the state and progression of a virtual pet. Step data provides an incentive to get away from the desk, go outside and remain active.

### Location-Based Mindfulness
Location-aware prompts encourage users to pay attention to their surroundings while walking, supporting the "Take Notice" aspect of the 5 Ways to Wellbeing.

### Geo-Notes
Users can interact with location-based notes, creating a lightweight community feature that allows students to discover messages connected to places around them.

### Weather Integration
The application integrates weather data using the Open-Meteo API to support context-aware features.

### Local Data Storage
User and application data is stored locally using JSON, allowing settings and other application state to persist between sessions.

## Tech Stack

- JavaScript
- React Native
- Expo
- Git
- Open-Meteo API
- JSON

## Project Structure

```text
Spiro/
├── assets/                     # Images and icons
├── src/
│   ├── backend/
│   │   ├── Initialiser.js      # JSON load/save logic
│   │   ├── Settings.js         # User settings logic
│   │   ├── Steps.js            # Step counter functionality
│   │   ├── GeoNotes.js         # Map markers and location logic
│   │   ├── Pet.js              # Virtual pet state logic
│   │   ├── Gallery.js          # Gallery data logic
│   │   └── Weather.js          # Open-Meteo API integration
│   │
│   └── screens/
│       ├── LandingPage.js      # Main application hub
│       ├── MapScreen.js        # Map and location markers
│       ├── GalleryScreen.js    # Nature and Geo-Notes interface
│       └── SettingsScreen.js   # User preferences
│
├── example.json                # Example data schema
├── App.js                      # Root application/navigation
├── app.json                    # Expo configuration
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Design Approach

Spiro was designed around a student persona experiencing high levels of academic workload and spending extended periods at a computer.

Rather than treating breaks as interruptions to productivity, the application aims to give users a reason to step away from their desk. Progression of the virtual pet provides an incentive for physical activity, while location-based prompts encourage users to engage with their surroundings.

This approach informed the project's combination of gamification, physical activity and mindfulness features.

## Contributors

Spiro was developed collaboratively as a **CS317 group project at the University of Strathclyde**.

- Ghassan Shalayel
- Natalie McGill
- Mohammad Rayyan Adhoni
- Callum Penney
- Erin Singleton
