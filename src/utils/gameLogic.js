// Simple AI decision: randomly play or pack
export function aiAction() {
  return Math.random() > 0.5 ? 'play' : 'pack';
}

// Note: Currently not used separately since AI logic is in App.js for simplicity