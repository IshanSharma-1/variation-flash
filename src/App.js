import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameSelection from './components/GameSelection';
import GameBoard from './components/GameBoard';
import { createDeck, shuffleDeck, dealCards } from './utils/deck';

// Define 15 Teen Patti variations with card counts
const variations = [
  { name: 'Normal', cards: 3 },
  { name: '3 in Muflis', cards: 3 },
  { name: '4 in Muflis', cards: 4 },
  { name: 'Kiss Miss & Jump', cards: 5 },
  { name: 'AK47 - III', cards: 3 },
  { name: 'AK47 IV', cards: 4 },
  { name: 'AK56-III', cards: 3 },
  { name: 'AK56-IV', cards: 4 },
  { name: 'K-Little', cards: 3 },
  { name: 'J-Little', cards: 3 },
  { name: 'Lallan Kallan', cards: 3 },
  { name: 'Any Card Joker-III', cards: 3 },
  { name: 'Any Card Joker-IV', cards: 4 },
  { name: '1942: A Love Story-III', cards: 3 },
  { name: '1942: A Love Story-IV', cards: 4 },
];

function App() {
  const [screen, setScreen] = useState('start'); // 'start', 'select', 'game'
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [players, setPlayers] = useState([
    { name: 'You', coins: 50, hand: [], isHuman: true, active: true },
    { name: 'AI 1', coins: 50, hand: [], isHuman: false, active: true },
    { name: 'AI 2', coins: 50, hand: [], isHuman: false, active: true },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameCount, setGameCount] = useState(0);

  // Transition to game selection screen
  const startSelection = () => setScreen('select');

  // Start a new game with the selected variation
  const startGame = (variation) => {
    setSelectedVariation(variation);
    const deck = shuffleDeck(createDeck());
    const hands = dealCards(deck, players.length, variation.cards);
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      hand: hands[index],
      active: true, // Reset active status
    }));
    setPlayers(updatedPlayers);
    setCurrentPlayer(0);
    setScreen('game');
  };

  // Handle turn ending: deduct coins, AI actions, and cycle turns
  const handleEndTurn = () => {
    let updatedPlayers = [...players];
    const player = updatedPlayers[currentPlayer];

    // Deduct 2 coins from current player if active
    if (player.active) {
      player.coins -= 2;
    }

    // AI decision: play or pack (randomly)
    if (!player.isHuman && player.active) {
      player.active = Math.random() > 0.5; // 50% chance to pack
    }

    // Move to next active player
    let nextPlayer = (currentPlayer + 1) % players.length;
    while (!updatedPlayers[nextPlayer].active && activePlayers(updatedPlayers) > 1) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }

    setPlayers(updatedPlayers);
    setCurrentPlayer(nextPlayer);

    // Check if game should end (e.g., only one player active)
    if (activePlayers(updatedPlayers) <= 1) {
      handlePlayAgain();
    }
  };

  // Count active players
  const activePlayers = (playersList) => playersList.filter((p) => p.active).length;

  // Reset game with a random variation
  const handlePlayAgain = () => {
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    setGameCount(gameCount + 1);
    startGame(randomVariation);
  };

  return (
    <div className="min-h-screen">
      {screen === 'start' && <StartScreen onStart={startSelection} />}
      {screen === 'select' && (
        <GameSelection variations={variations} onSelect={startGame} />
      )}
      {screen === 'game' && (
        <GameBoard
          players={players}
          variation={selectedVariation}
          currentPlayer={currentPlayer}
          onEndTurn={handleEndTurn}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;