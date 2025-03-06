# Card Game Project

This is a Teen Patti–inspired card game with a dynamic lobby. Players join by entering their names. During a match, players can choose to play blind (their cards remain hidden) or reveal them via a “Reveal Cards” button. Once revealed, they cannot return to blind mode. In addition, when a round ends, the player immediately clockwise from the winner is forced to play blind in the next round and must pay an extra 2 coins.

The UI displays the total coin pool, whose turn it is, and each player's balance. Place your 52 card images in the `/assets/cards/` folder.

## Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Build for production: `npm run build`
