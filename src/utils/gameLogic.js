// src/utils/gameLogic.js
export const aiDecisions = (activePlayersCount) => {
  const decisions = {};

  // If fewer players remain (e.g., human packed), AI is more likely to continue
  const continueProbability = activePlayersCount > 2 ? 0.7 : 0.9;

  decisions.ai1 = Math.random() < continueProbability;
  decisions.ai2 = Math.random() < continueProbability;

  return decisions;
};