// src/utils/gameLogic.js

export const aiDecisions = (activePlayersCount) => {
  const decisions = {};
  const continueProbability = activePlayersCount > 2 ? 0.7 : 0.9;
  decisions.ai1 = Math.random() < continueProbability;
  decisions.ai2 = Math.random() < continueProbability;
  return decisions;
};

export function upfrontDeduction(players, currentStake) {
  let pot = 0;
  const updatedPlayers = players.map(p => {
    let deduction = 1;
    if (p.mode === 'blind' && p.isHuman) {
      deduction = 2;
      p.skipCycle = true;
    }
    deduction = Math.min(deduction, p.coins);
    p.coins -= deduction;
    p.bet = deduction;
    pot += deduction;
    return p;
  });
  return { updatedPlayers, pot };
}

export function initializeRound(players, dragMeterValue) {
  let validStake = Math.min(dragMeterValue, 3);
  const minBalance = Math.min(...players.map(p => p.coins));
  if (minBalance < validStake) {
    validStake = minBalance > 0 ? minBalance : 1;
  }
  
  const updatedPlayers = players.map(p => ({
    ...p,
    bet: 0,
    hasFolded: false,
    isSeen: p.isHuman ? false : true,
    hasSeenCards: p.isHuman ? false : true,
    mode: p.isHuman ? 'blind' : 'seen'
  }));
  
  return {
    players: updatedPlayers,
    currentStake: validStake,
    pot: 0
  };
}

export function processPlayerTurn(players, currentPlayerIndex, choice, currentStake, pot) {
  const updatedPlayers = [...players];
  const player = updatedPlayers[currentPlayerIndex];
  
  if (choice === "fold") {
    player.hasFolded = true;
    return { players: updatedPlayers, currentStake, pot };
  }
  
  if (choice === "blind" && player.mode === "blind" && player.isHuman) {
    let turnBet = 1;
    if (player.coins < turnBet) turnBet = player.coins;
    player.bet += turnBet;
    player.coins -= turnBet;
    pot += turnBet;
    return { players: updatedPlayers, currentStake, pot };
  }
  
  if (choice === "seen" || choice === "show") {
    const seenTurnBet = 2;
    if (player.mode === "blind" && player.isHuman) {
      let additional = seenTurnBet - 1;
      if (player.coins < additional) additional = player.coins;
      player.bet += additional;
      player.coins -= additional;
      pot += additional;
      player.mode = "seen";
      player.isSeen = true;
      player.hasSeenCards = true;
    } else {
      let turnBet = seenTurnBet;
      if (player.coins < turnBet) turnBet = player.coins;
      player.bet += turnBet;
      player.coins -= turnBet;
      pot += turnBet;
    }
    
    if (choice === "show") {
      player.actionType = "show";
    }
    
    return { players: updatedPlayers, currentStake, pot };
  }
  
  return { players: updatedPlayers, currentStake, pot };
}

export function determineWinnerAndDistributePot(players, pot) {
  const activePlayers = players.filter(p => !p.hasFolded);
  
  if (activePlayers.length === 1) {
    const winnerIndex = players.findIndex(p => p.id === activePlayers[0].id);
    const updatedPlayers = [...players];
    updatedPlayers[winnerIndex].coins += pot;
    return {
      players: updatedPlayers,
      winner: updatedPlayers[winnerIndex],
      pot: 0
    };
  }
  
  return {
    players,
    winner: null,
    pot
  };
}

export function isRoundOver(players) {
  const activePlayers = players.filter(p => !p.hasFolded);
  return (
    activePlayers.length === 1 ||
    (activePlayers.length > 1 && activePlayers.every(p => p.bet > 0))
  );
}

export function getAIDecision(player, currentStake, activePlayers) {
  const foldThreshold = activePlayers > 2 ? 0.3 : 0.2;
  const lowCoinsThreshold = currentStake * 5;
  const randomFactor = Math.random();
  
  if (player.coins < lowCoinsThreshold) {
    if (randomFactor < foldThreshold * 1.5) {
      return "fold";
    }
  }
  
  if (randomFactor < foldThreshold) {
    return "fold";
  }
  
  return "seen";
}