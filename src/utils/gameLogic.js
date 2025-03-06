export function getNextPlayer(players, currentPlayerId) {
  const currentIndex = players.findIndex((player) => player.id === currentPlayerId);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
}

export function distributeCards(deck, players, gameType) {
  const cardsPerPlayer = {
    normal: 3,
    '3-in-Muflis': 3,
    '4-in-Muflis': 4,
    'Kiss-Miss-Jump': 5,
    'AK47-III': 3,
    'AK47-IV': 4,
    'AK56-III': 3,
    'AK56-IV': 4,
    'K-Little': 3,
    'J-Little': 3,
    'Lallan-Kallan': 3,
    'Any-Card-Joker-III': 3,
    'Any-Card-Joker-IV': 4,
    '1942-A-Love-Story-III': 3,
    '1942-A-Love-Story-IV': 4,
  };

  const cardsToDeal = cardsPerPlayer[gameType];
  return players.map((player) => {
    player.cards = deck.splice(0, cardsToDeal).map(card => ({ ...card, flipped: false }));
    return player;
  });
}

export function calculateCoins(players, gameType) {
  let bowlCoins = 0;
  players.forEach((player) => {
    if (player.isBlind) {
      player.coins -= 2;
      bowlCoins += 2;
    } else {
      player.coins -= 1;
      bowlCoins += 1;
    }
  });
  return bowlCoins;
}