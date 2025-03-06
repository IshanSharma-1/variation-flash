// Game state with player data.
let gameState = {
    players: [],
    currentTurn: 0,
    pool: 0,
    gameCount: 1,
    active: true
  };
  
  export function initGame(players) {
    // Initialize players with additional blind-related properties.
    gameState.players = players.map(player => {
      let p = { ...player, active: true, isBlind: false, hasRevealed: false, compulsoryBlind: player.compulsoryBlind || false };
      if (p.compulsoryBlind) {
        p.isBlind = true;
        // Deduct extra 2 coins for compulsory blind.
        p.coins -= 2;
        gameState.pool += 2;
      }
      return p;
    });
    gameState.currentTurn = 0;
    gameState.pool = 0;
    gameState.gameCount = 1;
    gameState.active = true;
  }
  
  export function addCoins(playerIndex, amount) {
    if (!gameState.active) return;
    // Deduct coins from current player and add to the pool.
    gameState.players[playerIndex].coins -= amount;
    gameState.pool += amount;
    nextTurn();
  }
  
  export function pack(playerIndex) {
    if (!gameState.active) return;
    // Mark player as packed.
    gameState.players[playerIndex].active = false;
    nextTurn();
  }
  
  export function revealCards(playerIndex) {
    // Player chooses to reveal their cards.
    gameState.players[playerIndex].hasRevealed = true;
    gameState.players[playerIndex].isBlind = false;
  }
  
  function nextTurn() {
    const totalPlayers = gameState.players.length;
    let next = (gameState.currentTurn + 1) % totalPlayers;
    while (!gameState.players[next].active && gameState.players.some(p => p.active)) {
      next = (next + 1) % totalPlayers;
    }
    gameState.currentTurn = next;
    // If only one active player remains, they win the pool.
    if (gameState.players.filter(p => p.active).length === 1) {
      declareWinner();
    }
  }
  
  function declareWinner() {
    gameState.active = false;
    const winner = gameState.players.find(p => p.active);
    if (winner) {
      winner.coins += gameState.pool;
      resetGame(winner);
    }
  }
  
  function resetGame(winner) {
    // Force the next player clockwise from the winner to play blind.
    const totalPlayers = gameState.players.length;
    let winnerIndex = gameState.players.indexOf(winner);
    let nextIndex = (winnerIndex + 1) % totalPlayers;
    gameState.players[nextIndex].compulsoryBlind = true;
    
    // Reset all players to active and update blind settings.
    gameState.players = gameState.players.map(p => ({
      ...p,
      active: true,
      isBlind: p.compulsoryBlind ? true : false,
      hasRevealed: false
    }));
    
    gameState.currentTurn = nextIndex;
    gameState.pool = 0;
    gameState.gameCount++;
    gameState.active = true;
  }
  
  export function getGameState() {
    return gameState;
  }
  