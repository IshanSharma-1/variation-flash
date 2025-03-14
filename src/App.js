import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import GameBoard from './components/GameBoard';
import WinnerSelectionModal from './components/WinnerSelectionModal';
import CongratulationsModal from './components/CongratulationsModal';
import { aiDecisions } from './utils/gameLogic';
import { createDeck, shuffleDeck, dealCards } from './utils/deck';

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
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [players, setPlayers] = useState([
    { name: 'You', coins: 50, hand: [], isHuman: true, active: true, usedCoins: 0, isBlind: false, blindCount: 0, hasSeenCards: false, didUserPickBlindUpfront: false, skipTurnThisRound: false },
    { name: 'AI 1', coins: 50, hand: [], isHuman: false, active: true, usedCoins: 0, isBlind: false, blindCount: 0, hasSeenCards: false, skipTurnThisRound: false },
    { name: 'AI 2', coins: 50, hand: [], isHuman: false, active: true, usedCoins: 0, isBlind: false, blindCount: 0, hasSeenCards: false, skipTurnThisRound: false },
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
  const [blindChoicePhase, setBlindChoicePhase] = useState(false);
  const [roundCount, setRoundCount] = useState(1);
  const [playersSkippedInRound1, setPlayersSkippedInRound1] = useState(0);
  const [showAllCards, setShowAllCards] = useState(false);
  const [currentRoundPool, setCurrentRoundPool] = useState(0); // New state for tracking round pool

  const prizePool = 150;
  const isAITurnProcessing = useRef(false);

  const startGame = (variation) => {
    setSelectedVariation(variation);
    setBlindChoicePhase(true);
    setCurrentRoundPool(0); // Reset round pool at game start
  };

  const handleUserBlindChoice = (choice) => {
    setPlayers((prev) => {
      const updated = [...prev];
      const userIndex = 0;
      let userCoinsDeducted = 0;
      let aiCoinsDeducted = 0;

      if (choice === 'blind') {
        updated[userIndex].isBlind = true;
        updated[userIndex].blindCount = 1;
        updated[userIndex].coins -= 2;
        updated[userIndex].usedCoins += 2;
        userCoinsDeducted = 2;
      } else {
        updated[userIndex].coins -= 1;
        updated[userIndex].usedCoins += 1;
        userCoinsDeducted = 1;
        updated[userIndex].isBlind = false;
        updated[userIndex].hasSeenCards = true;
      }
      updated[userIndex].skipTurnThisRound = true;

      // Deduct 1 coin from each AI
      updated.forEach((p, idx) => {
        if (!p.isHuman && p.active) {
          p.coins -= 1;
          p.usedCoins = 1;
          p.skipTurnThisRound = true;
          aiCoinsDeducted += 1;
        }
      });

      // Update round pool by total deducted
      setCurrentRoundPool((prevPool) => prevPool + userCoinsDeducted + aiCoinsDeducted);

      return updated;
    });

    setBlindChoicePhase(false);
    setCurrentPlayer(0);
    distributeCards(selectedVariation);
  };

  const distributeCards = async (variation) => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setDealing(true);
    const hands = dealCards(newDeck, players.length, variation.cards);
    const tempDealtHands = players.map(() => []);
    for (let cycle = 0; cycle < variation.cards; cycle++) {
      for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
        if (hands[playerIndex][cycle]) {
          tempDealtHands[playerIndex].push(hands[playerIndex][cycle]);
          setDealtHands([...tempDealtHands]);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    }
    setPlayers((prev) =>
      prev.map((player, index) => ({
        ...player,
        hand: hands[index] || [],
        active: true,
      }))
    );
    setDealing(false);
    setGamePhase('playing');
    setShowAICards(false);
    setPlayersSkippedInRound1(0);
    await new Promise((resolve) => setTimeout(resolve, 500));
    nextTurn();
  };

  const handlePlayBlind = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      if (updated[currentPlayer].blindCount < 2) {
        updated[currentPlayer].isBlind = true;
        updated[currentPlayer].blindCount += 1;
        updated[currentPlayer].coins -= 2;
        updated[currentPlayer].usedCoins += 2;
        setCurrentRoundPool(prevPool => prevPool + 2); // Add to round pool
      }
      return updated;
    });
  };

  const handleSeeCards = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[currentPlayer].isBlind = false;
      updated[currentPlayer].hasSeenCards = true;
      return updated;
    });
  };

  const handleContinue = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[currentPlayer].coins -= 2;
      updated[currentPlayer].usedCoins += 2;
      setCurrentRoundPool(prevPool => prevPool + 2); // Add to round pool
      return updated;
    });
    nextTurn();
  };

  const handleOut = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[currentPlayer].active = false;
      return updated;
    });
    if (activePlayers() === 1) {
      awardPrizeToWinner();
    } else if (activePlayers() === 2) {
      setGamePhase('showdown');
    }
    nextTurn();
  };

  const handleRevealCards = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      if (updated[currentPlayer].isHuman && !updated[currentPlayer].hasSeenCards) {
        updated[currentPlayer].isBlind = false;
        updated[currentPlayer].hasSeenCards = true;
      }
      return updated;
    });
  };

  const handleBlindShow = () => {
    if (activePlayers() === 2 && players[currentPlayer].isHuman && !players[currentPlayer].hasSeenCards) {
      console.log('Blind Show triggered, setting showAllCards to true');
      setShowAllCards(true);
      setTimeout(() => setShowWinnerModal(true), 2000);
    } else {
      console.log('Blind Show conditions not met:', {
        activePlayers: activePlayers(),
        isHuman: players[currentPlayer].isHuman,
        hasSeenCards: players[currentPlayer].hasSeenCards,
      });
    }
  };

  const handleShow = () => {
    if (activePlayers() === 2 && players[currentPlayer].isHuman) {
      setShowAllCards(true); // Reveal all cards during regular show
      setTimeout(() => setShowWinnerModal(true), 2000);
    }
  };

  const handleSelectWinner = (winnerName) => {
    setShowWinnerModal(false);
    if (winnerName !== null) {
      const updatedPlayers = [...players];
      const activePlayersList = updatedPlayers.filter((p) => p.active);
      if (activePlayersList.length === 2) {
        const winnerPlayer = activePlayersList.find((p) => p.name === winnerName);
        const loserPlayer = activePlayersList.find((p) => p.name !== winnerName);
        if (winnerPlayer && loserPlayer) {
          const winnerGlobalIndex = updatedPlayers.findIndex((p) => p.name === winnerPlayer.name);
          updatedPlayers[winnerGlobalIndex].coins += currentRoundPool; // Use current round pool
          updatedPlayers[winnerGlobalIndex].usedCoins = 0;
          const loserGlobalIndex = updatedPlayers.findIndex((p) => p.name === loserPlayer.name);
          updatedPlayers[loserGlobalIndex].active = false;
          updatedPlayers[loserGlobalIndex].usedCoins = 0;
        }
      }
      setPlayers(updatedPlayers);
      const finalWinner = updatedPlayers.find((p) => p.active);
      setWinner(finalWinner);
      setShowCongratulationsModal(true);
      setTimeout(() => {
        setShowCongratulationsModal(false);
        resetGame();
      }, 5000);
    }
  };

  const handleQuit = () => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[currentPlayer].active = false;
      return updated;
    });
    awardPrizeToWinner();
  };

  const nextTurn = () => {
    let next = (currentPlayer + 1) % players.length;
    while (!players[next].active) {
      next = (next + 1) % players.length;
    }

    if (roundCount === 1 && players[next].skipTurnThisRound) {
      setPlayers((prev) => {
        const updated = [...prev];
        updated[next].skipTurnThisRound = false;
        return updated;
      });
      setPlayersSkippedInRound1((prev) => prev + 1);
      if (playersSkippedInRound1 + 1 === activePlayers()) {
        setRoundCount(2);
        setCurrentPlayer(0);
        setPlayersSkippedInRound1(0);
      } else {
        setCurrentPlayer(next);
      }
    } else if (players[next].skipTurnThisRound) {
      setPlayers((prev) => {
        const updated = [...prev];
        updated[next].skipTurnThisRound = false;
        return updated;
      });
      next = (next + 1) % players.length;
      while (!players[next].active) {
        next = (next + 1) % players.length;
      }
      if (next === 0) {
        setRoundCount((prev) => prev + 1);
      }
      setCurrentPlayer(next);
    } else {
      if (next === 0) {
        setRoundCount((prev) => prev + 1);
      }
      setCurrentPlayer(next);
    }
  };

  const activePlayers = () => players.filter((p) => p.active).length;

  const awardPrizeToWinner = () => {
    const winnerIndex = players.findIndex((p) => p.active);
    if (winnerIndex !== -1) {
      const updatedPlayers = [...players];
      updatedPlayers[winnerIndex].coins += currentRoundPool; // Use current round pool
      updatedPlayers[winnerIndex].usedCoins = 0;
      updatedPlayers.forEach((p, idx) => {
        if (idx !== winnerIndex) p.usedCoins = 0;
      });
      setPlayers(updatedPlayers);
      setWinner(updatedPlayers[winnerIndex]);
      setShowCongratulationsModal(true);
      setTimeout(() => {
        setShowCongratulationsModal(false);
        resetGame();
      }, 5000);
    }
  };

  const resetGame = () => {
    const totalCoins = players.reduce((sum, p) => sum + p.coins, 0);
    const adjustment = 150 - totalCoins;
    const coinsPerPlayer = Math.floor((150 + adjustment) / 3);

    setSelectedVariation(null);
    setGamePhase('playing');
    setShowAICards(false);
    setShowAllCards(false);
    setDealtHands([]);
    setCurrentPlayer(0);
    setRoundCount(1);
    setPlayersSkippedInRound1(0);
    setCurrentRoundPool(0); // Reset round pool
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({
        ...player,
        hand: [],
        active: true,
        coins: coinsPerPlayer,
        usedCoins: 0,
        isBlind: false,
        blindCount: 0,
        hasSeenCards: false,
        didUserPickBlindUpfront: false,
        skipTurnThisRound: false,
      }))
    );
  };

  // AI player turn logic
  useEffect(() => {
    const current = players[currentPlayer];
    if (
      !current.isHuman &&
      current.active &&
      activePlayers() > 1 &&
      !current.skipTurnThisRound &&
      !isAITurnProcessing.current
    ) {
      isAITurnProcessing.current = true;
      const timer = setTimeout(() => {
        const decisions = aiDecisions(activePlayers());
        setPlayers((prev) => {
          const updated = [...prev];
          const p = updated[currentPlayer];
          if (!p.isHuman && p.active && !p.skipTurnThisRound) {
            const decision = decisions[`ai${currentPlayer}`];
            console.log(`AI ${currentPlayer} - Decision: ${decision}`);
            if (decision && p.coins >= 2) {
              console.log(`AI ${currentPlayer} - Before deduction: Coins = ${p.coins}, UsedCoins = ${p.usedCoins}, CurrentRoundPool = ${currentRoundPool}`);
              p.coins -= 2; // Consistently 2 coins for AI
              p.usedCoins += 2;
              setCurrentRoundPool((prevPool) => prevPool + 2); // Add to round pool - using functional update
              console.log(`AI ${currentPlayer} - After deduction: Coins = ${p.coins}, UsedCoins = ${p.usedCoins}, CurrentRoundPool = ${currentRoundPool}`);
            } else {
              console.log(`AI ${currentPlayer} - Cannot continue, going out: Coins = ${p.coins}, UsedCoins = ${p.usedCoins}`);
              p.active = false;
            }
          }
          return updated;
        });
        if (activePlayers() === 1) {
          awardPrizeToWinner();
        } else if (activePlayers() === 2) {
          setGamePhase('showdown');
        }
        nextTurn();
        isAITurnProcessing.current = false;
      }, 1500);
      return () => {
        clearTimeout(timer);
        isAITurnProcessing.current = false;
      };
    }
  }, [currentPlayer, players]);

  if (showStartScreen) {
    return <StartScreen onStart={() => setShowStartScreen(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center relative">
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
      ) : blindChoicePhase ? (
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
        <>
          <GameBoard
            players={players}
            currentPlayer={currentPlayer}
            onContinue={handleContinue}
            onOut={handleOut}
            variation={selectedVariation}
            prizePool={prizePool}
            currentRoundPool={currentRoundPool} // Pass the current round pool
            gamePhase={gamePhase}
            onRevealCards={handleRevealCards}
            onBlindShow={handleBlindShow}
            onShow={handleShow}
            onQuit={handleQuit}
            dealing={dealing}
            dealtHands={dealtHands}
            showAICards={showAICards}
            onPlayBlind={handlePlayBlind}
            onSeeCards={handleSeeCards}
            roundCount={roundCount}
            showAllCards={showAllCards}
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