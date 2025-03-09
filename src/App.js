// App.js
import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import WinnerSelectionModal from './components/WinnerSelectionModal';
import CongratulationsModal from './components/CongratulationsModal';
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
    { name: 'You', coins: 50, hand: [], isHuman: true, active: true, usedCoins: 0 },
    { name: 'AI 1', coins: 50, hand: [], isHuman: false, active: true, usedCoins: 0 },
    { name: 'AI 2', coins: 50, hand: [], isHuman: false, active: true, usedCoins: 0 },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [gamePhase, setGamePhase] = useState('playing');
  const [showAICards, setShowAICards] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [dealtHands, setDealtHands] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const prizePool = 150;

  // Start a new game with the selected variation
  const startGame = async (variation) => {
    setSelectedVariation(variation);
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setDealing(true);

    const hands = dealCards(newDeck, players.length, variation.cards);
    const tempDealtHands = Array.from({ length: players.length }, () => []);
    for (let cycle = 0; cycle < variation.cards; cycle++) {
      for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
        if (hands[playerIndex][cycle]) {
          tempDealtHands[playerIndex].push(hands[playerIndex][cycle]);
          setDealtHands([...tempDealtHands]);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    const updatedPlayers = players.map((player, index) => ({
      ...player,
      hand: hands[index] || [],
      active: true,
      usedCoins: 0,
    }));
    setPlayers(updatedPlayers);
    setDealing(false);
    setCurrentPlayer(0);
    setGamePhase('playing');
    setShowAICards(false);
  };

  // Handle human player's "Continue" action
  const handleContinue = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].coins -= 2;
    updatedPlayers[currentPlayer].usedCoins += 2;
    setPlayers(updatedPlayers);
    nextTurn();
  };

  // Handle human player's "Out" action
  const handleOut = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].active = false;
    setPlayers(updatedPlayers);
    if (activePlayers() === 1) {
      awardPrizeToWinner();
    } else if (activePlayers() === 2) {
      setGamePhase('showdown');
    }
    nextTurn();
  };

  // Handle "Show" action
  const handleShow = () => {
    if (activePlayers() === 2 && players[currentPlayer].isHuman) {
      setShowAICards(true);
      setTimeout(() => setShowWinnerModal(true), 2000);
    }
  };

  // Handle winner selection
  const handleSelectWinner = (winnerIndex) => {
    console.log('Winner selection triggered with index:', winnerIndex);
    setShowWinnerModal(false);
    if (winnerIndex !== null) {
      let updatedPlayers = [...players];
      const activePlayersList = updatedPlayers.filter((p) => p.active);
      const loserIndex = activePlayersList.findIndex((p) => p.name !== updatedPlayers[winnerIndex].name);
      const coinsWon = updatedPlayers[loserIndex].usedCoins;
      updatedPlayers[winnerIndex].coins += coinsWon;
      updatedPlayers[loserIndex].active = false;
      setPlayers(updatedPlayers);
      setWinner(updatedPlayers[winnerIndex]);
      console.log('Setting showCongratulationsModal to true');
      setShowCongratulationsModal(true);
      setTimeout(() => {
        console.log('Closing CongratulationsModal');
        setShowCongratulationsModal(false);
        resetGame();
      }, 5000); // Increased to 5 seconds to see confetti
    }
  };

  // Handle human player's "Quit" action
  const handleQuit = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].active = false;
    setPlayers(updatedPlayers);
    awardPrizeToWinner();
  };

  // Move to the next active player
  const nextTurn = () => {
    let next = (currentPlayer + 1) % players.length;
    while (!players[next].active && activePlayers() > 1) {
      next = (next + 1) % players.length;
    }
    setCurrentPlayer(next);
  };

  // Count active players
  const activePlayers = () => players.filter((p) => p.active).length;

  // Award prize to the last remaining player
  const awardPrizeToWinner = () => {
    const winnerIndex = players.findIndex((p) => p.active);
    if (winnerIndex !== -1) {
      let updatedPlayers = [...players];
      const coinsWon = updatedPlayers
        .filter((p, index) => index !== winnerIndex)
        .reduce((sum, p) => sum + p.usedCoins, 0);
      updatedPlayers[winnerIndex].coins += coinsWon;
      setPlayers(updatedPlayers);
      setWinner(updatedPlayers[winnerIndex]);
      console.log('Setting showCongratulationsModal to true (awardPrizeToWinner)');
      setShowCongratulationsModal(true);
      setTimeout(() => {
        console.log('Closing CongratulationsModal (awardPrizeToWinner)');
        setShowCongratulationsModal(false);
        resetGame();
      }, 5000); // Increased to 5 seconds to see confetti
    }
  };

  // Reset game to variation selection, preserving coin totals
  const resetGame = () => {
    setSelectedVariation(null);
    setGamePhase('playing');
    setShowAICards(false);
    setDealtHands([]);
    setCurrentPlayer(0);
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({
        ...player,
        hand: [],
        active: true,
        usedCoins: 0,
      }))
    );
  };

  // Handle AI turns for all AI players
  useEffect(() => {
    const current = players[currentPlayer];
    if (!current.isHuman && current.active && activePlayers() > 1) {
      const timer = setTimeout(() => {
        const decisions = aiDecisions(activePlayers());
        let updatedPlayers = [...players];

        // Apply decisions to all AI players
        updatedPlayers.forEach((player, index) => {
          if (!player.isHuman && player.active) {
            const decision = decisions[`ai${index}`];
            if (decision) {
              updatedPlayers[index].coins -= 2;
              updatedPlayers[index].usedCoins += 2;
            } else {
              updatedPlayers[index].active = false;
            }
          }
        });

        setPlayers(updatedPlayers);

        if (activePlayers() === 1) {
          awardPrizeToWinner();
        } else if (activePlayers() === 2) {
          setGamePhase('showdown');
        }
        nextTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, players]);

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center">
      {!selectedVariation ? (
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
        <>
          <GameBoard
            players={players}
            currentPlayer={currentPlayer}
            onContinue={handleContinue}
            onOut={handleOut}
            variation={selectedVariation}
            prizePool={prizePool}
            gamePhase={gamePhase}
            onShow={handleShow}
            onQuit={handleQuit}
            dealing={dealing}
            dealtHands={dealtHands}
            showAICards={showAICards}
          />
          {showWinnerModal && (
            <WinnerSelectionModal
              players={players.filter((p) => p.active)}
              onSelectWinner={handleSelectWinner}
            />
          )}
          {showCongratulationsModal && winner && (
            <CongratulationsModal winner={winner} />
          )}
        </>
      )}
    </div>
  );
}

export default App;