import React, { useState, useEffect } from 'react';
import PlayerPanel from './PlayerPanel';
import CoinPool from './CoinPool';
import Controls from './Controls';
import { initGame, getGameState, addCoins, pack, revealCards } from '../utils/gameLogic';
import { randomizeMatches } from '../utils/matchRandomizer';

const GameBoard = ({ players }) => {
  const [gameState, setGameState] = useState({ players: [], pool: 0, currentTurn: 0, gameCount: 1 });

  useEffect(() => {
    // Initialize game state with dynamic players.
    initGame(players);
    setGameState(getGameState());
  }, [players]);

  const updateGameState = () => {
    setGameState({ ...getGameState() });
  };

  const handlePlay = () => {
    // Deduct 2 coins from the current player and add to pool.
    addCoins(gameState.currentTurn, 2);
    updateGameState();
  };

  const handlePack = () => {
    pack(gameState.currentTurn);
    updateGameState();
  };

  const handleReveal = () => {
    revealCards(gameState.currentTurn);
    updateGameState();
  };

  // After 3 games, randomize match order.
  useEffect(() => {
    setGameState(prevState =>{
    if (gameState.gameCount > 3) {
      const randomized = randomizeMatches([...prevState.players]);
      return{...prevState, players: randomized};
    }
    return prevState;
    });
  }, [gameState.gameCount]);

  const currentPlayer = gameState.players[gameState.currentTurn];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Teen Patti Game</h1>
      <CoinPool total={gameState.pool} />
      <div className="flex flex-wrap gap-4">
        {gameState.players.map((player, index) => (
          <PlayerPanel key={index} player={player} isCurrent={index === gameState.currentTurn} />
        ))}
      </div>
      <div className="mt-4">
        <p className="text-lg">
          It's <span className="font-bold">{currentPlayer?.name}</span>'s turn.
        </p>
        <Controls 
          onPlay={handlePlay} 
          onPack={handlePack} 
          onReveal={handleReveal} 
          currentPlayer={currentPlayer} 
        />
      </div>
      <div className="mt-4">
        <p className="text-sm">Game Count: {gameState.gameCount}</p>
      </div>
    </div>
  );
};

export default GameBoard;
