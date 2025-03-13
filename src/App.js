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
    {
      name: 'You',
      coins: 50,
      hand: [],
      isHuman: true,
      active: true,
      usedCoins: 0,
      isBlind: false,
      blindCount: 0,
    },
    {
      name: 'AI 1',
      coins: 50,
      hand: [],
      isHuman: false,
      active: true,
      usedCoins: 0,
      isBlind: false,
      blindCount: 0,
    },
    {
      name: 'AI 2',
      coins: 50,
      hand: [],
      isHuman: false,
      active: true,
      usedCoins: 0,
      isBlind: false,
      blindCount: 0,
    },
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

  // For the upfront choice of Blind/Seen
  const [blindChoicePhase, setBlindChoicePhase] = useState(false);

  const prizePool = 150;

  // Start a new game: let user pick a variation, then pick Blind or Seen
  const startGame = (variation) => {
    setSelectedVariation(variation);
    setBlindChoicePhase(true);
  };

  // User picks Blind or Seen at start
  const handleUserBlindChoice = (choice) => {
    setPlayers((prev) => {
      const updated = [...prev];
      const userIndex = 0;
      if (choice === 'blind') {
        if (updated[userIndex].blindCount < 2) {
          updated[userIndex].isBlind = true;
          updated[userIndex].blindCount += 1;
        } else {
          updated[userIndex].isBlind = false;
        }
      } else {
        updated[userIndex].isBlind = false;
      }
      return updated;
    });

    // AI also picks Blind or Seen if they have blinds left
    setPlayers((prev) => {
      return prev.map((player) => {
        if (!player.isHuman && player.blindCount < 2 && player.active) {
          const aiChoice = Math.random() < 0.5 ? 'blind' : 'seen';
          if (aiChoice === 'blind') {
            player.isBlind = true;
            player.blindCount += 1;
          } else {
            player.isBlind = false;
          }
        }
        return player;
      });
    });

    setBlindChoicePhase(false);
    distributeCards(selectedVariation);
  };

  // Deal cards after Blind/Seen choices
  const distributeCards = async (variation) => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setDealing(true);

    const hands = dealCards(newDeck, players.length, variation.cards);
    const tempDealtHands = Array.from({ length: players.length }, () => []);

    // Deal in cycles so we can show a small animation
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

  // Switch to blind again if still have tries
  const handlePlayBlind = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      const userIndex = currentPlayer;
      if (updated[userIndex].blindCount < 2) {
        updated[userIndex].isBlind = true;
        updated[userIndex].blindCount += 1;
      }
      return updated;
    });
  };

  // Switch to “seen” if currently blind
  const handleSeeCards = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[currentPlayer].isBlind = false;
      return updated;
    });
  };

  // “Continue” action
  const handleContinue = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].coins -= 2;
    updatedPlayers[currentPlayer].usedCoins += 2;
    setPlayers(updatedPlayers);
    nextTurn();
  };

  // “Out” action
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

  // “Show” action
  const handleShow = () => {
    if (activePlayers() === 2 && players[currentPlayer].isHuman) {
      setShowAICards(true);
      setTimeout(() => setShowWinnerModal(true), 2000);
    }
  };

  // Choose a winner from the showdown
  const handleSelectWinner = (winnerIndex) => {
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
      setShowCongratulationsModal(true);
      setTimeout(() => {
        setShowCongratulationsModal(false);
        resetGame();
      }, 5000);
    }
  };

  // “Quit” action
  const handleQuit = () => {
    let updatedPlayers = [...players];
    updatedPlayers[currentPlayer].active = false;
    setPlayers(updatedPlayers);
    awardPrizeToWinner();
  };

  // Move to next active player
  const nextTurn = () => {
    let next = (currentPlayer + 1) % players.length;
    while (!players[next].active && activePlayers() > 1) {
      next = (next + 1) % players.length;
    }
    setCurrentPlayer(next);
  };

  // Count active players
  const activePlayers = () => players.filter((p) => p.active).length;

  // Award coins to the last player standing
  const awardPrizeToWinner = () => {
    const winnerIndex = players.findIndex((p) => p.active);
    if (winnerIndex !== -1) {
      let updatedPlayers = [...players];
      const coinsWon = updatedPlayers
        .filter((_, idx) => idx !== winnerIndex)
        .reduce((sum, p) => sum + p.usedCoins, 0);
      updatedPlayers[winnerIndex].coins += coinsWon;
      setPlayers(updatedPlayers);
      setWinner(updatedPlayers[winnerIndex]);
      setShowCongratulationsModal(true);
      setTimeout(() => {
        setShowCongratulationsModal(false);
        resetGame();
      }, 5000);
    }
  };

  // NEW UPDATE: Reset blindCount in addition to isBlind
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
        isBlind: false,
        blindCount: 0, // reset so next game’s blind logic works correctly
      }))
    );
  };

  // AI auto-decisions
  useEffect(() => {
    const current = players[currentPlayer];
    if (!current.isHuman && current.active && activePlayers() > 1) {
      const timer = setTimeout(() => {
        const decisions = aiDecisions(activePlayers());
        let updatedPlayers = [...players];

        updatedPlayers.forEach((player, index) => {
          if (!player.isHuman && player.active) {
            const decision = decisions[`ai${index}`];
            if (decision) {
              player.coins -= 2;
              player.usedCoins += 2;
            } else {
              player.active = false;
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
        // Variation selection
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
      ) : blindChoicePhase ? (
        // Blind or Seen upfront
        <div className="flex flex-col items-center space-y-4 text-white">
          <h2 className="text-2xl">Do you want to Play Blind or Play Seen?</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleUserBlindChoice('blind')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Play Blind
            </button>
            <button
              onClick={() => handleUserBlindChoice('seen')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Play Seen
            </button>
          </div>
        </div>
      ) : (
        // Main game flow
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
            onPlayBlind={handlePlayBlind}
            onSeeCards={handleSeeCards}
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