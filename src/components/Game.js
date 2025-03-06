import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { getNextPlayer, distributeCards, calculateCoins } from '../utils/gameLogic';
import { createDeck } from '../utils/shuffle';
import { playSound } from '../utils/audio';
import coinSound from '../assets/sounds/coin.mp3';
import cardFlipSound from '../assets/sounds/card-flip.mp3';
import cardShuffleSound from '../assets/sounds/card-shuffle.mp3';
import Player from './Player';

const socket = io('http://localhost:5000');

function Game() {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameState, setGameState] = useState({
    gameType: 'normal',
    coins: 50,
    cards: [],
    currentTurn: null,
    remainingCards: [],
    bowlCoins: 0,
  });

  useEffect(() => {
    socket.emit('joinGame', roomId);

    socket.on('updatePlayers', (players) => {
      setPlayers(players);
    });

    socket.on('currentPlayer', (currentPlayer) => {
      setCurrentPlayer(currentPlayer);
    });

    socket.on('gameState', (state) => {
      setGameState(state);
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('currentPlayer');
      socket.off('gameState');
    };
  }, [roomId]);

  const startGame = () => {
    const deck = createDeck();
    const gameType = 'normal'; // First 3 games by default normal, can be randomized later
    const updatedPlayers = distributeCards(deck, players, gameType);
    const remainingCards = deck.slice();
    const bowlCoins = calculateCoins(players, gameType);
    const gameState = {
      gameType,
      coins: 50,
      cards: deck,
      currentTurn: updatedPlayers[0].id,
      remainingCards,
      bowlCoins,
    };
    socket.emit('setGameState', { roomId, gameState });
    playSound(cardShuffleSound);
  };

  const nextTurn = () => {
    const nextPlayerId = getNextPlayer(players, currentPlayer);
    setCurrentPlayer(nextPlayerId);
    socket.emit('nextTurn', { roomId, nextPlayerId });
  };

  const handleCoinDrop = () => {
    playSound(coinSound);
  };

  const flipCard = (playerId, cardIndex) => {
    if (playerId === currentPlayer) {
      const updatedPlayers = players.map((player) => {
        if (player.id === playerId) {
          player.cards[cardIndex].flipped = !player.cards[cardIndex].flipped;
        }
        return player;
      });
      setPlayers(updatedPlayers);
      playSound(cardFlipSound);
    }
  };

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('card', JSON.stringify(card));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData('card'));
    console.log('Dropped card:', card);
    // Add logic to handle the dropped card
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="game">
      <h1>Game Room: {roomId}</h1>
      <div className="players">
        {players.map((player) => (
          <Player
            key={player.id}
            player={player}
            currentPlayer={currentPlayer}
            flipCard={flipCard}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
      <button onClick={startGame}>Start Game</button>
      <button onClick={nextTurn}>Next Turn</button>
      <div className="coin" onClick={handleCoinDrop}></div>
      <h2>Game Type: {gameState.gameType}</h2>
      <h2>Coins: {gameState.coins}</h2>
      <div className="drag-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
        Drag and drop cards here
      </div>
      <div className="remaining-cards">
        {gameState.remainingCards.map((card, index) => (
          <div key={index} className="card card-back"></div>
        ))}
      </div>
    </div>
  );
}

export default Game;