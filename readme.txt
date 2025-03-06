Teen Patti Game Documentation

Overview

This document provides comprehensive product documentation for an online Teen Patti game, covering features, user flow, game mechanics, assets, and variations. The game offers a seamless real-time multiplayer experience without requiring user login, ensuring instant access for players.

Features

Welcome Screen

No login required.

Displays game title and branding.

Ads positioned at the bottom of the screen for visibility.

"Create Room" button for initiating a new game session.

Quick access to game rules and variations.

Multiplayer Gameplay

Maximum of 8 players per room.

Room creator generates and shares a unique game link for others to join.

Real-time voice chat with mute/unmute functionality.

Animated reaction icons to enhance player interaction.

Game operates using a standard 52-card deck.

User-friendly UI designed for mobile and desktop platforms.

Coins System

Each player starts with 50 coins.

Players decide at the start of each game whether to play blind or see their cards.

Blind players contribute 2 coins, and non-blind players contribute 1 coin.

Maximum of 2 blind turns per person per game.

Coins accumulate in a central bowl throughout the game.

1 coin holds a value of Rs. 10.

Players who lose all their coins have their balance turn negative.

Players can view their remaining balance at all times.

Gameplay Flow

Players join a room (minimum 2, maximum 8 players).

Room creator selects a game variation (first 3 games default to "Normal").

Players decide to play blind (max 2 times in a game) or reveal their cards.

Cards are shuffled and distributed based on the game variation.

Turns progress in a circular order around the table.

Players can either pack (exit the round) or contribute 2 coins to continue playing.

When only two players remain, they can request a "show" to reveal cards or continue playing.

The winner collects all coins accumulated in the bowl.

The next game starts with the left-side player of the winner contributing an extra coin.

Players vote on the next game variation before proceeding.

If a player’s balance turns negative, they can still continue playing shown as negative money.

User Flow

Welcome Screen → Players can create or join a game room.

Room Creation → A unique game link is generated.

Waiting for Players → Minimum 2 players needed, maximum of 8 allowed.

Players Join & Choose Nicknames → Each player picks a display name.

Game Start → Rules displayed, players choose to play blind or not.

Gameplay Progresses → Turns move in a circular sequence.

Round Ends → Winner collects all accumulated coins.

Next Round Begins → Players decide the next game variation.

Session Continues → Players can exit or continue playing new rounds.

Game Variations

Normal: 3 cards per player.

3 in Muflis: 3 cards.

4 in Muflis: 4 cards.

Kiss Miss & Jump: 5 cards.

AK47 - III: 3 cards.

AK47 IV: 4 cards.

AK56-III: 3 cards.

AK56-IV: 4 cards.

K-Little: 3 cards.

J-Little: 3 cards.

Lallan Kallan: 3 cards.

Any Card Joker-III: 3 cards.

Any Card Joker-IV: 4 cards.

1942: A Love Story-III: 3 cards.

1942: A Love Story-IV: 4 cards.

Game Logic

Deck is shuffled randomly based on the game type (3, 4, or 5 cards per player).

If a game variation requires 5 cards, blind play is disabled, and all players must contribute 1 coin before card distribution.

Ensure all players have contributed coins before shuffling and distributing cards.

Fair random distribution of cards for all players.

Automatic game type allotment (first 3 games are always "Normal").

Negative balance tracking is enabled, allowing players to continue borrowing coins.

Coins are visually placed into a bowl at the center of the table.

After card distribution, remaining cards are placed near the bowl.

A circular player turn indicator highlights the active participant.

Live tracking of total coins in the game’s pot.

if the player is playing blind, they cant see their cards until they no longer want to play blind or their blind limit is exhausted for the game.

3 white card like squares can be shown for those blind playing players

all other players can view their cards on their screens

Required Assets

52 Deck of Cards → Digitally designed for an optimized experience - already available in repo.

High-Quality UI Elements → Aesthetic and intuitive.

Card Shuffling Animations → Smooth animations for realism.

Coin Drop Animations → Coins visually falling into the bowl.

2D Circular Table UI → Displays players' names and avatars.

Audio & UI Feedback → Enhanced interactivity and game immersion.

Live Chat & Reactions → Text chat and quick reaction emojis.

Game Hosting → Hosted on GitHub Pages for seamless deployment.

Customizable Themes → Players can choose different UI themes for a personalized experience.

Tech Stack & Best Practices

Frontend: React.js, Tailwind CSS for responsive styling.

Backend: Node.js with WebSockets for real-time multiplayer functionality.

UI Framework: ShadCN/UI for high-quality UI elements.

Hosting: GitHub Pages for front-end deployment, Firebase for real-time database and game sessions.

Animations: Framer Motion for smooth visual transitions and interactions.

Security Measures: End-to-end encryption for voice chat and user interactions.

Optimization: Lazy loading assets for faster load times.

Cross-Platform Compatibility: Fully responsive design for mobile, tablet, and desktop.

Performance Testing: Load testing to ensure smooth gameplay at full capacity.

This detailed documentation ensures the game is designed to provide a highly engaging, intuitive, and visually appealing multiplayer experience while maintaining best-in-class UI/UX principles and game mechanics.

