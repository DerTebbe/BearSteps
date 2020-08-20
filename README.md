# BearSteps

![BearSteps Logo](./src/assets/Logo.png)

<br>

BearSteps turns your neighbourhood into a playing field! 
The app offers exciting outdoor games, 
where the course of the game is determined by the movement of the players.
Planning, preparation and execution is done by the App. 
Playing becomes so easy that you can start immediately at any time and any place. Thus the focus is on the experience.


#### Game 1: "Find Mr. X"

"Find Mr. X" is the first game we implemented. From a group of players, one member is appointed Mr. X. 
Their goal is to hide from the other players, the detectives, for a set time. 
During this time Mr. X sees the positions of the detectives permanently. Meanwhile the detectives must try to catch Mr. X. 
To help them surround him they are given the position of Mr. X at regular intervals.

## Authors

Naila Agirman, Caja-Sophie Jakobs, Niklas Schmitt and Felix Tebbe developed this app in their degree program Social Media Systems as part of the module ''Integrationsprojekt 2''.

## Technologies

The App was developed with the Open-Source Webframework
Ionic, which is based on Angular using the web technologies HTML, SCSS and TypeScript.
The backend is implemented using Google Firebase.
<br>
<br>
![Technologies](https://dl.dropbox.com/s/7sq6lrgw1242wxa/Systemarchitektur.png)

<br>
---

## Requirements

To run the application local on your or any other devices, it 
is necessary to make sure the following steps have been fulfilled.

- Node and NPM have been installed
- Java SE Development Kit 8 has been installed

## Getting Started

First of all you need to install all the npm module requirements, which are listed
in package.json and ordered by package-lock.json. Just run 

```
    > npm install
```

in the root directory, where you can find the package.json. All necessary modules
will be installed right there.

To run the application on your browser type the following command

```
    > npm run local 
```

## Quality assurance

To run all unit tests of the components and services type the following command

```
    > npm run test 
```

To check the code with tslint run

```
    > npm run lint
```

## Documentation

The documentation can be found here: https://bearsteps-docs-be62b.firebaseapp.com/
