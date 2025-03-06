export function playSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.play();
}