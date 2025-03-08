import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import { aiDecisions } from './utils/gameLogic';
import { createDeck, shuffleDeck, dealCards } from './utils/deck';

// Define the 15 game variations with their card counts
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
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [players, setPlayers] = useState([
    { name: 'You', coins: 50, hand: [], isHuman: true, active: true },
    { name: 'AI 1', coins: 50, hand: [], isHuman: false, active: true },
    { name: 'AI 2', coins: 50, hand: [], isHuman: false, active: true },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));

    // <!-- NEW LOGIC: START -->
    const [prizePool, setPrizePool] = useState(0); // Track the prize pool
    const [gamePhase, setGamePhase] = useState('playing'); // 'playing' or 'showdown'
    // <!-- NEW LOGIC: END -->

  // Start a new game with the selected variation
  const startGame = (variation) => {
    setSelectedVariation(variation);
    const hands = dealCards(deck, players.length, variation.cards); // Deal cards based on variation
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      hand: hands[index] || [], //FIXXXXXXXXXXXXXXXX IF FAILS INDEX]
      active: true, // Reset all players to active
    }));
    setPlayers(updatedPlayers);
    setCurrentPlayer(0); // Start with the human player
    // <!-- NEW LOGIC: START -->
    setPrizePool(0); // Reset prize pool at the start of the game
    setGamePhase('playing'); // Reset game phase
    // <!-- NEW LOGIC: END -->
  };

  // Handle human player's "Continue" action
  const handleContinue = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].coins -= 2; // Deduct 2 coins for continuing
    setPlayers(updatedPlayers);
    // <!-- NEW LOGIC: START -->
    setPrizePool(prizePool + 2); // Add to prize pool
    // <!-- NEW LOGIC: END -->
    nextTurn(); // Move to the next player
  };

  // Handle human player's "Out" action
  const handleOut = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].active = false; // Mark player as inactive
    setPlayers(updatedPlayers);
    // <!-- NEW LOGIC: START -->
    if (activePlayers() === 1) {
      awardPrizeToWinner();
    } else if (activePlayers() === 2) {
      setGamePhase('showdown'); // Enter showdown phase
    }
    // <!-- NEW LOGIC: END -->
    nextTurn(); // Move to the next player
  };

   // <!-- NEW LOGIC: START -->
  // Handle human player's "Show" action (reveal cards)
  const handleShow = () => {
    // For simplicity, assume the human wins if they show (you can add card comparison logic later)
    awardPrizeToWinner();
  };

  // Handle human player's "Quit" action
  const handleQuit = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].active = false; // Mark human as inactive
    setPlayers(updatedPlayers);
    awardPrizeToWinner(); // Last remaining player wins
  };
  // <!-- NEW LOGIC: END -->

  // Move to the next active player
  const nextTurn = () => {
    let next = (currentPlayer + 1) % players.length;
    while (!players[next].active && activePlayers() > 1) {
      next = (next + 1) % players.length; // Skip inactive players
    }
    setCurrentPlayer(next);
  };

  // Count the number of active players
  const activePlayers = () => players.filter((p) => p.active).length;

  // <!-- NEW LOGIC: START -->
  // Award the prize pool to the winner
  const awardPrizeToWinner = () => {
    const winnerIndex = players.findIndex((p) => p.active);
    if (winnerIndex !== -1) {
      let updatedPlayers = [...players];
      updatedPlayers[winnerIndex].coins += prizePool;
      setPlayers(updatedPlayers);
      alert(`${players[winnerIndex].name} wins the prize pool of ${prizePool} coins!`);
    }
    setGamePhase('ended');
  };
  // <!-- NEW LOGIC: END -->

  // Handle AI turns automatically
  useEffect(() => {
    const current = players[currentPlayer];
    if (!current.isHuman && current.active && activePlayers() > 1) {
      const timer = setTimeout(() => {
        const decisions = aiDecisions(); // Get AI decisions (one continues, one packs)
        let updatedPlayers = [...players];
        if (currentPlayer === 1) {
          // AI 1's turn, also decide for AI 2 to ensure they don't decide the same
          updatedPlayers[1].active = decisions.ai1;
          updatedPlayers[1].coins -= decisions.ai1 ? 2 : 0; // Deduct coins if continuing
          // <!-- NEW LOGIC: START -->
          if (decisions.ai1) setPrizePool(prizePool + 2);
          // <!-- NEW LOGIC: END -->
          updatedPlayers[2].active = decisions.ai2;
          updatedPlayers[2].coins -= decisions.ai2 ? 2 : 0;
          // <!-- NEW LOGIC: START -->
          if (decisions.ai2) setPrizePool(prizePool + 2);
          // <!-- NEW LOGIC: END -->
        }
        setPlayers(updatedPlayers);
        // <!-- NEW LOGIC: START -->
        if (activePlayers() === 1) {
          awardPrizeToWinner();
        } else if (activePlayers() === 2) {
          setGamePhase('showdown');
        }
        // <!-- NEW LOGIC: END -->
        nextTurn();
      }, 1000); // 1-second delay to simulate AI thinking
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [currentPlayer, players]);

    // <!-- NEW LOGIC: START -->
  // Calculate the total prize pool (sum of all players' coins)
  const totalPrizePool = players.reduce((sum, player) => sum + player.coins, 0);
  // <!-- NEW LOGIC: END -->

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      {!selectedVariation ? (
        // Display variation selection screen
        <div className="text-white">
          <h1 className="text-3xl mb-4">Select a Game Variation</h1>
          <div className="grid grid-cols-3 gap-4">
            {variations.map((variation) => (
              <button
                key={variation.name}
                onClick={() => startGame(variation)}
                className="p-4 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {variation.name} ({variation.cards} cards)
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Display the game board once a variation is selected
        <GameBoard
          players={players}
          currentPlayer={currentPlayer}
          onContinue={handleContinue}
          onOut={handleOut}
          variation={selectedVariation}
          totalPrizePool={totalPrizePool}
           // <!-- NEW LOGIC: START -->
           prizePool={prizePool}
           gamePhase={gamePhase}
           onShow={handleShow}
           onQuit={handleQuit}
           // <!-- NEW LOGIC: END -->
        />
      )}
    </div>
  );
}

export default App;