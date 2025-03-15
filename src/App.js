import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import GameBoard from './components/GameBoard';
import WinnerSelectionModal from './components/WinnerSelectionModal';
import CongratulationsModal from './components/CongratulationsModal';
import {
  initializeRound,
  processPlayerTurn,
  isRoundOver,
  determineWinnerAndDistributePot,
  upfrontDeduction,
  getAIDecision
} from './utils/gameLogic';
import { createDeck, shuffleDeck, dealCards } from './utils/deck';

// Game variations
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
  const [gamePhase, setGamePhase] = useState('setup');
  
  const [players, setPlayers] = useState([
    { id: 1, name: 'You', coins: 50, bet: 0, hand: [], isHuman: true, hasFolded: false, isSeen: false, hasSeenCards: false, mode: 'blind' },
    { id: 2, name: 'AI 1', coins: 50, bet: 0, hand: [], isHuman: false, hasFolded: false, isSeen: true, hasSeenCards: true, mode: 'seen' },
    { id: 3, name: 'AI 2', coins: 50, bet: 0, hand: [], isHuman: false, hasFolded: false, isSeen: true, hasSeenCards: true, mode: 'seen' }
  ]);
  
  const [currentStake, setCurrentStake] = useState(1);
  const [dragMeterValue, setDragMeterValue] = useState(1);
  const [pot, setPot] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [dealtHands, setDealtHands] = useState([]);
  
  const [deck, setDeck] = useState([]);
  const isAITurnProcessing = useRef(false);
  
  // Reset game to initial state, preserving coins
  const resetGame = () => {
    setPlayers(prev =>
      prev.map(player => ({
        ...player,
        bet: 0,
        hand: [],
        hasFolded: false,
        isSeen: player.isHuman ? false : true,
        hasSeenCards: player.isHuman ? false : true,
        mode: player.isHuman ? 'blind' : 'seen'
      }))
    );
    setPot(0);
    setCurrentStake(1);
    setDragMeterValue(1);
    setCurrentPlayerIndex(0);
    setCurrentCycle(1);
    setGamePhase('setup');
    setShowAllCards(false);
    setDealtHands([]);
    setWinner(null);
    setSelectedVariation(null); // Return to variation selection
  };
  
  const startGame = (variation) => {
    setSelectedVariation(variation);
    setGamePhase('stakeSelection');
  };
  
  const handleStakeChange = (value) => {
    setDragMeterValue(value);
  };
  
  const handleStakeSelection = () => {
    const { players: newPlayers, currentStake: validStake } = initializeRound(players, dragMeterValue);
    const { updatedPlayers, pot: upfrontPot } = upfrontDeduction(newPlayers, validStake);
    
    setPlayers(updatedPlayers);
    setCurrentStake(validStake);
    setPot(upfrontPot);
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
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    setPlayers(prev => 
      prev.map((player, index) => ({
        ...player,
        hand: hands[index] || [],
      }))
    );
    
    setDealing(false);
    setGamePhase('betting');
    setCurrentPlayerIndex(0);
    if (players[0].mode === 'blind' && players[0].isHuman) {
      advanceToNextPlayer(players);
    }
  };
  
  const handlePlayerAction = (choice) => {
    const { players: updatedPlayers, currentStake: updatedStake, pot: updatedPot } =
      processPlayerTurn(players, currentPlayerIndex, choice, currentStake, pot);
    
    if (choice === "seen" && updatedPlayers[currentPlayerIndex].isHuman) {
      updatedPlayers[currentPlayerIndex].hasSeenCards = true;
    }
    
    setPlayers([...updatedPlayers]);
    setCurrentStake(updatedStake);
    setPot(updatedPot);
    
    // Just add this one extra setShowWinnerModal(true) when 2 players remain
    if (choice === "show" && updatedPlayers.filter(p => !p.hasFolded).length === 2) {
      setGamePhase('showdown');
      setShowAllCards(true);
      setShowWinnerModal(true); // ← add this line
    } else {
      advanceToNextPlayer(updatedPlayers);
    }
  };
  
  const advanceToNextPlayer = (currentPlayers = players) => {
    const activePlayers = currentPlayers.filter(p => !p.hasFolded);
    if (activePlayers.length <= 1) {
      checkRoundStatus(currentPlayers, pot);
      return;
    }
    
    let nextIndex = (currentPlayerIndex + 1) % currentPlayers.length;
    while (currentPlayers[nextIndex].hasFolded) {
      nextIndex = (nextIndex + 1) % currentPlayers.length;
    }
    
    if (nextIndex <= currentPlayerIndex) {
      setCurrentCycle(prev => prev + 1);
    }
    
    setCurrentPlayerIndex(nextIndex);
  };
  
  const checkRoundStatus = (currentPlayers, currentPot) => {
    const activePlayers = currentPlayers.filter(p => !p.hasFolded);
    if (activePlayers.length === 1) {
      const { players: playersAfterWin, winner: roundWinner } =
        determineWinnerAndDistributePot(currentPlayers, currentPot);
      setPlayers(playersAfterWin);
      setPot(0);
      setWinner(roundWinner);
      setShowCongratulationsModal(true);
      
      setTimeout(() => {
        setShowCongratulationsModal(false);
        const anyPlayerOut = playersAfterWin.some(p => p.coins <= 0);
        if (anyPlayerOut) {
          setGamePhase('gameOver');
        } else {
          resetGame(); // Return to variation selection
        }
      }, 3000);
    }
  };
  
  // Reset for a new round, preserving coins
  const resetForNewRound = () => {
    setGamePhase('stakeSelection');
    setDragMeterValue(1);
    setCurrentPlayerIndex(0);
    setCurrentCycle(1);
    setPot(0);
    setCurrentStake(1);
    setShowAllCards(false);
    
    setPlayers(prev =>
      prev.map(player => ({
        ...player,
        bet: 0,
        hand: [],
        hasFolded: false,
        isSeen: player.isHuman ? false : true,
        hasSeenCards: player.isHuman ? false : true,
        mode: player.isHuman ? 'blind' : 'seen'
      }))
    );
  };
  
  const handleSelectWinner = (winnerName) => {
    setShowWinnerModal(false);
    if (winnerName !== null) {
      const updatedPlayers = [...players];
      const winnerPlayer = updatedPlayers.find(p => p.name === winnerName);
      if (winnerPlayer) {
        const winnerIndex = updatedPlayers.findIndex(p => p.name === winnerName);
        updatedPlayers[winnerIndex].coins += pot;
      }
      setPlayers(updatedPlayers);
      setPot(0);
      setWinner(winnerPlayer);
      setShowCongratulationsModal(true);
      
      setTimeout(() => {
        setShowCongratulationsModal(false);
        const anyPlayerOut = updatedPlayers.some(p => p.coins <= 0);
        if (anyPlayerOut) {
          setGamePhase('gameOver');
        } else {
          resetGame(); // Return to variation selection
        }
      }, 3000);
    } else {
      setShowAllCards(false);
      setGamePhase('betting');
    }
  };
  
  useEffect(() => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer?.isHuman && gamePhase === 'betting' && !isAITurnProcessing.current) {
      isAITurnProcessing.current = true;
      
      setTimeout(() => {
        const activePlayers = players.filter(p => !p.hasFolded).length;
        const aiAction = getAIDecision(currentPlayer, currentStake, activePlayers);
        
        handlePlayerAction(aiAction);
        isAITurnProcessing.current = false;
      }, 1500);
    }
  }, [currentPlayerIndex, gamePhase, players]);
  
  if (showStartScreen) {
    return <StartScreen onStart={() => setShowStartScreen(false)} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center relative p-4">
      {!selectedVariation ? (
        <div className="text-white glassmorphic-bg p-8 rounded-xl">
          <h1 className="text-3xl mb-8 text-center gold-gradient-text">Select a Game Variation</h1>
          <div className="grid grid-cols-3 gap-4">
            {variations.map(variation => (
              <button
                key={variation.name}
                onClick={() => startGame(variation)}
                className="p-4 bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
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
            currentPlayerIndex={currentPlayerIndex}
            currentStake={currentStake}
            dragMeterValue={dragMeterValue}
            onStakeChange={handleStakeChange}
            pot={pot}
            variation={selectedVariation}
            gamePhase={gamePhase}
            dealing={dealing}
            dealtHands={dealtHands}
            showAllCards={showAllCards}
            onPlayerAction={handlePlayerAction}
            currentCycle={currentCycle}
          />
          
          {gamePhase === 'stakeSelection' && (
            <button
              onClick={handleStakeSelection}
              className="mt-6 px-8 py-3 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 golden-hover"
            >
              Start Round with Stake: {dragMeterValue}
            </button>
          )}
          
          {showWinnerModal && (
            <WinnerSelectionModal
              players={players.filter(p => !p.hasFolded)}
              onSelectWinner={handleSelectWinner}
            />
          )}
          
          {showCongratulationsModal && winner && (
            <CongratulationsModal winner={winner} />
          )}
          
          {gamePhase === 'gameOver' && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="glassmorphic-bg p-8 rounded-xl text-center w-full max-w-md">
                <h2 className="text-2xl mb-4 text-white">Game Over</h2>
                <p className="text-gray-300 mb-6">One or more players ran out of coins!</p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                >
                  Start New Game
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;