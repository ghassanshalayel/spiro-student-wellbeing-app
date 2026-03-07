# Spiro: Student Destresser App
### CS317 Group Project 

## Project Overview
Spiro is a mobile health application designed to help students like "Johnny" manage exam stress. The app gamifies physical activity by linking real-world steps to the growth and happiness of a virtual pet. It is built on the 5 Ways to Wellbeing:

***Be Active***: Pedometer-based step tracking.

***Take Notice***: Location-based mindfulness prompts.

***Connect/Give/Learn***: Community-driven "Geo-Notes" and nature challenges.

## Our Persona: Johnny (The Stressed Student)
***Status***: 3rd-year CS student.  He is going through the third year wall right now where the theory of what he is learning is becoming
 like a mountain. He is juggling a heavy course load and the constant pressure of technical interview preperations. Between trying to keep his test scores high and building a portfolio to land a summer internship, Johnny has neglected his physical self.

***Problem***: Due to his entire world being contained on his computer screen, Johnny has fallen into a cycle of physical neglect. 
During exam season, he can go 72 hours without leaving his home as he is always on the grind. The lack of physical activity has
resulted in erratic sleep patterns, painful joints and muscles and a brain fog which actually results in his studying being less effective. He knows he should exercise, but his todo list is too big right now and the gym seems like an indulgence that he cant go through. His stress is caused largely in part due to his physical stagnation.

***Goal***: Johnny needs a break, he needs to step away from his desk. He has tried different study methods like setting alarms 
and the pomodoro technique but these just feel like distractions to him. He needs a way to be able to leave what he is working on 
and not feel a crushing guilt of being "unproductive". He needs motivation, something that will keep him accountable that can turn
a walk or outdoor activity into a meaningful mission.

***App Benefit***: Introducing Spiro. Spiro will serve as the emotional bridge and motivation that Johnny's brain cannot ignore.
Spiro will keep users like Johnny motivated by serving as a pet whos mood and level will be determined by how active the user us.
When Spiro gets sad or lazy or lonely, the app will push a notification to Johnny telling him to take a walk. This walk will be mindful also. The resulting walk isn't just about hitting a step count, either. Spiro guides Johnny through mindful "Take Notice" moments, forcing him to disengage from his work and centre himself in his surroundings. Ultimately, the app tricks Johnny into taking the mental reset he desperately needs, using his own empathy as the primary motivator to de-stress and recharge

Gamified Stress Reduction (Be Active): By linking Spiro’s growth and happiness to a pedometer, Spiro turns a mundane walk into a level-up opportunity. For a CS student, this mimics the satisfying progression of a game or a successful code deployment which will provide a hit of dopamine also.

Environmental Grounding (Take Notice): The app uses location-based prompts to force micro-mindfulness. As Johnny walks, Buddy might point out a specific landmark or a change in the weather, dragging Johnny back into the physical world.

Social Validation (Connect/Give/Learn): Through "Geo-Notes," the app reduces the isolation of exam season. Johnny can find digital notes left by other stressed people on the same trail, realizing he isn't alone in his struggle. This creates a "passive community" that provides support without the social exhaustion of a direct conversation.



## File Structure
```bash
Spiro/
├── assets/                     # Images and icons 
├── node_modules/               # Installed libraries (Navigation, Maps, etc.)
├── src/
│   ├── backend/                # Logic files already created
│   │   ├── Initialiser.js      # JSON load/save logic
│   │   ├── Settings.js         # User Settings logic
│   │   ├── Steps.js            # Step counter functions
│   │   ├── Geolocation.js      # Location logic
│   │   ├── Pet.js              # Pet state logic
│   │   └── Gallery.js          # Gallery data logic
│   ├── screens/                # The UI components for each page
│   │   ├── LandingPage.js      # Main hub with 3 buttons
│   │   ├── MapScreen.js        # View with MapView and Markers
│   │   ├── GalleryScreen.js    # Placeholder for Nature/Geo-Notes
│   │   └── SettingsScreen.js   # UI for user preferences
│   └── example.json            # data example
├── App.js                      # Root component with NavigationContainer
├── app.json                    # Expo configuration
├── package.json                # Project dependencies and scripts
├── index.js                    # Entry point for the app
└── README.md                   # Project documentation

## How we store the Local Data?

we store the data in JSON format

in future, new values can be added or be removed

### The Schema
[Click Me to see the Schema](src\example.json)