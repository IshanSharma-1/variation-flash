export function randomizeMatches(players) {
    if (players.length > 2) {
      for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
      }
    }
    return players;
  }
  