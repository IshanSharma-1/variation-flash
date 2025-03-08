// Function to determine AI decisions (one continues, one packs)
export function aiDecisions() {
  const firstAIContinues = Math.random() < 0.5; // Randomly decide for AI 1
  return {
    ai1: firstAIContinues, // true = continue, false = out
    ai2: !firstAIContinues // AI 2 does the opposite of AI 1
  };
}