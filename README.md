# rookMove

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mrobox7/rookMove)](https://github.com/MRoboX7/rookMove/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mrobox7/rookMove)](https://github.com/MRoboX7/rookMove/network)
[![GitHub issues](https://img.shields.io/github/issues/mrobox7/rookMove)](https://github.com/MRoboX7/rookMove/issues)

A brief description of your app.

## Table of Contents

- [Introduction](#introduction)
- [Server Setup](#server-setup)
- [Client Setup](#client-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Provide an introduction to your app, what it does, and any important background information.

## Server Setup

### Clone the Repository

To get started with the server part, clone the repository to your local machine:

```
git clone https://github.com/MRoboX7/rookMove.git
```

### Navigate to the Server Directory
Change your working directory to the server folder:
```
cd Server
```
### Install Node Modules
To install the required Node.js packages and dependencies for the server, use npm:
```
npm install
```

### Start the Server
Start the server using nodemon, which automatically restarts the server when code changes are detected:
```
npm start
```

### Restart the Server
To manually restart the server at any time, use the shortcut:
```
rs
```

## Client Setup
### Navigate Back to the Parent Directory
Return to the parent directory of the repository:
```
cd..
```

### Navigate to the Client Directory
Navigate to the client directory:
```
cd client
```

### Install Node Modules
Install the required Node.js packages and dependencies for the client:
```
npm install
```

### Start the Client
To start the client, execute:
```
npm run dev
```
This will open the client application in a web browser, displaying the local host address. Keep this terminal window open.

### Open the Client in a New Tab
In your web browser, open a new tab and enter the same local host address displayed in the terminal. This will act as a second client.

### Restart the Client
To restart the client application, use the following command:
```
r
```

## Usage
- The game will be played on an 8x8 chessboard.
- There will be two players, and they will take turns to move the rook. Rooks starts from the top right square.
- **On each turn, a player can move the rook any number of steps to the left or down, but not up, right or diagonally.**
- The player who reaches the bottom-left corner of the board first wins the game.
- Each player will have 30 seconds to make their move.
- If a player does not make a move within the allocated time, the game is over.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
