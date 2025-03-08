// Define suits and ranks for a standard 52-card deck
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

// Create a fresh deck of 52 cards
export function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

// Shuffle the deck using Fisher-Yates algorithm
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Deal cards to players based on variation
export function dealCards(deck, numPlayers, cardsPerPlayer) {
  const hands = Array.from({ length: numPlayers }, () => []);
  const shuffledDeck = [...deck];
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (shuffledDeck.length > 0) {
        hands[j].push(shuffledDeck.shift());
      }
    }
  }
  return hands;
}