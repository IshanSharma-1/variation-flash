const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createDeck } = require('../src/utils/shuffle');
const { distributeCards, getNextPlayer, calculateCoins } = require('../src/utils/gameLogic');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, name }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push({ id: socket.id, name, coins: 50, cards: [], isBlind: false });
    socket.join(roomId);
    io.to(roomId).emit('updatePlayers', rooms[roomId]);
  });

  socket.on('joinGame', (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('updatePlayers', rooms[roomId]);
  });

  socket.on('setGameState', ({ roomId, gameState }) => {
    io.to(roomId).emit('gameState', gameState);
  });

  socket.on('nextTurn', ({ roomId, nextPlayerId }) => {
    io.to(roomId).emit('currentPlayer', nextPlayerId);
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((player) => player.id !== socket.id);
      io.to(roomId).emit('updatePlayers', rooms[roomId]);
    }
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});