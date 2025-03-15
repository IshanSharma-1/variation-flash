import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import GameModeSelection from './components/GameModeSelection';
import CustomMatchSetup from './components/CustomMatchSetup';
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
  // Game flow states
  const [gameState, setGameState] = useState('startScreen');
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [playerCount, setPlayerCount] = useState(3);
  
  // Game mechanics states
  const [players, setPlayers] = useState([]);
  const [currentStake, setCurrentStake] = useState(1);
  const [dragMeterValue, setDragMeterValue] = useState(1);
  const [pot, setPot] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  
  // UI states
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [dealtHands, setDealtHands] = useState([]);
  
  const [deck, setDeck] = useState([]);
  const isAITurnProcessing = useRef(false);
  
  // Initialize players based on selected count
  const initializePlayers = (count) => {
    const newPlayers = [];
    
    // Always add the human player first
    newPlayers.push({
      id: 1, 
      name: 'You', 
      coins: 50, 
      bet: 0, 
      hand: [], 
      isHuman: true, 
      hasFolded: false, 
      isSeen: false, 
      hasSeenCards: false, 
      mode: 'blind'
    });
    
    // Add AI players with royal names for better theme
    const aiNames = [
      'Baron', 'Duchess', 'Earl', 'Knight', 'Viscount', 
      'Marquess', 'Count', 'Prince', 'Emperor', 'Duke'
    ];
    
    for (let i = 2; i <= count; i++) {
      newPlayers.push({
        id: i,
        name: aiNames[i-2] || `AI ${i-1}`,
        coins: 50,
        bet: 0,
        hand: [],
        isHuman: false,
        hasFolded: false,
        isSeen: true,
        hasSeenCards: true,
        mode: 'seen'
      });
    }
    
    return newPlayers;
  };
  
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
    // Send player to customMatchSetup but retain player count
    setGameState('customMatchSetup');
    setShowAllCards(false);
    setDealtHands([]);
    setWinner(null);
    setSelectedVariation(null);
    // Don't reset playerCount here - keep it the same
  };
  
  // Handle game mode selection
  const handleModeSelection = (mode) => {
    if (mode === 'custom') {
      setGameState('customMatchSetup');
    } else if (mode === 'local') {
      // Local multiplayer not implemented yet
      alert('Local Multiplayer coming soon!');
    }
  };
  
  // Handle start of custom match
  const startCustomMatch = (count, variation) => {
    setPlayerCount(count);
    setSelectedVariation(variation);
    setPlayers(initializePlayers(count));
    setGameState('stakeSelection');
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
    setGameState('betting');
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
    
    if (choice === "show" && updatedPlayers.filter(p => !p.hasFolded).length === 2) {
      setGameState('showdown');
      setShowAllCards(true);
      setShowWinnerModal(true);
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
          setGameState('gameOver');
        } else {
          resetGame();
        }
      }, 3000);
    }
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
          setGameState('gameOver');
        } else {
          resetGame();
        }
      }, 3000);
    } else {
      setShowAllCards(false);
      setGameState('betting');
    }
  };
  
  useEffect(() => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer?.isHuman && gameState === 'betting' && !isAITurnProcessing.current) {
      isAITurnProcessing.current = true;
      
      setTimeout(() => {
        const activePlayers = players.filter(p => !p.hasFolded).length;
        const aiAction = getAIDecision(currentPlayer, currentStake, activePlayers);
        
        handlePlayerAction(aiAction);
        isAITurnProcessing.current = false;
      }, 1500);
    }
  }, [currentPlayerIndex, gameState, players]);
  
  // Create a gradual fading background transition between game states
  const getBackgroundClass = () => {
    switch (gameState) {
      case 'startScreen':
        return '';
      case 'modeSelection':
      case 'customMatchSetup':
        return 'royal-background';
      default:
        return 'game-background';
    }
  };
  
  // Render based on game state
  const renderGameState = () => {
    switch (gameState) {
      case 'startScreen':
        return <StartScreen onStart={() => setGameState('modeSelection')} />;
      
      case 'modeSelection':
        return <GameModeSelection onSelectMode={handleModeSelection} />;
      
      case 'customMatchSetup':
        return (
          <CustomMatchSetup 
            variations={variations} 
            onStartCustomMatch={startCustomMatch}
            onBack={() => setGameState('modeSelection')}
            players={players} // Pass players to detect returning player
          />
        );
      
      case 'stakeSelection':
      case 'betting':
      case 'showdown':
      case 'gameOver':
        return (
          <div className="min-h-screen bg-gradient-to-b from-green-900 to-gray-900 flex flex-col items-center justify-center relative p-4">
            <GameBoard
              players={players}
              currentPlayerIndex={currentPlayerIndex}
              currentStake={currentStake}
              dragMeterValue={dragMeterValue}
              onStakeChange={handleStakeChange}
              pot={pot}
              variation={selectedVariation}
              gamePhase={gameState}
              dealing={dealing}
              dealtHands={dealtHands}
              showAllCards={showAllCards}
              onPlayerAction={handlePlayerAction}
              currentCycle={currentCycle}
              handleStakeSelection={handleStakeSelection} // Add this line to pass the function
            />
            
            {showWinnerModal && (
              <WinnerSelectionModal
                players={players.filter(p => !p.hasFolded)}
                onSelectWinner={handleSelectWinner}
              />
            )}
            
            {showCongratulationsModal && winner && (
              <CongratulationsModal winner={winner} />
            )}
            
            {gameState === 'gameOver' && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="royal-card p-8 rounded-xl text-center w-full max-w-md">
                  <h2 className="text-2xl mb-4 embossed">Game Over</h2>
                  <div className="royal-divider"></div>
                  <p className="text-yellow-200 mb-6">One or more players ran out of coins!</p>
                  <button
                    onClick={resetGame}
                    className="royal-btn mt-4 px-8 py-3"
                  >
                    <span className="card-suit suit-club">♣</span> Return to Setup <span className="card-suit suit-diamond">♦</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return <StartScreen onStart={() => setGameState('modeSelection')} />;
    }
  };
  
  return <div className={getBackgroundClass()}>{renderGameState()}</div>;
}

export default App;