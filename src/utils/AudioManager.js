// Audio Manager utility for handling game sounds

// Create preloaded audio objects with the correct path
const audioFiles = {
  oneCoin: new Audio(process.env.PUBLIC_URL + '/assets/sound/oneCoin.mp3'),
  twoCoins: new Audio(process.env.PUBLIC_URL + '/assets/sound/twoCoins.mp3'),
  congrats: new Audio(process.env.PUBLIC_URL + '/assets/sound/win.mp3'),
  start: new Audio(process.env.PUBLIC_URL + '/assets/sound/start.mp3'),
  ambient: new Audio(process.env.PUBLIC_URL + '/assets/sound/ambient.mp3')
};

// Set loop properties
audioFiles.start.loop = true;
audioFiles.ambient.loop = true;

// Preload all sounds
Object.values(audioFiles).forEach(audio => {
  audio.load();
});

// Audio manager functions
export const playCoinSound = (amount) => {
  try {
    if (amount === 1) {
      audioFiles.oneCoin.currentTime = 0;
      audioFiles.oneCoin.play().catch(err => console.log('Audio play error:', err));
    } else if (amount >= 2) {
      audioFiles.twoCoins.currentTime = 0;
      audioFiles.twoCoins.play().catch(err => console.log('Audio play error:', err));
    }
  } catch (error) {
    console.log('Error playing coin sound:', error);
  }
};

// Play winning sound - limited to 5 seconds
export const playWinSequence = (onComplete = () => {}) => {
  try {
    if (!audioFiles.congrats) {
      console.log('Win audio not loaded yet, creating new Audio');
      audioFiles.congrats = new Audio(process.env.PUBLIC_URL + '/assets/sound/win.mp3');
    }
    
    audioFiles.congrats.currentTime = 0;
    audioFiles.congrats.volume = 1.0;
    
    // Create a promise that resolves when the audio ends or after 5 seconds
    return new Promise((resolve, reject) => {
      // Create a timeout that will stop the sound after 5 seconds
      const timeoutId = setTimeout(() => {
        audioFiles.congrats.pause();
        audioFiles.congrats.currentTime = 0;
        audioFiles.congrats.removeEventListener('ended', handleEnded);
        console.log('Win sound stopped after 5 seconds');
        onComplete();
        resolve();
      }, 5000);
      
      // Add an event listener for when the audio ends naturally (before 5 seconds)
      const handleEnded = () => {
        clearTimeout(timeoutId);
        audioFiles.congrats.removeEventListener('ended', handleEnded);
        onComplete();
        resolve();
      };
      
      audioFiles.congrats.addEventListener('ended', handleEnded);
      
      // Play the sound
      audioFiles.congrats.play()
        .then(() => {
          console.log('Win sound playing successfully');
        })
        .catch(err => {
          clearTimeout(timeoutId);
          console.log('Congrats audio play error:', err);
          audioFiles.congrats.removeEventListener('ended', handleEnded);
          onComplete();
          reject(err);
        });
    });
  } catch (error) {
    console.log('Error in win sequence:', error);
    setTimeout(onComplete, 1000);
    return Promise.reject(error);
  }
};

// Start music controls
export const playStartMusic = () => {
  try {
    // Ensure ambient music is stopped when start music plays
    stopAmbientMusic();
    
    audioFiles.start.currentTime = 0;
    return audioFiles.start.play()
      .catch(err => {
        console.log('Start music play error:', err);
        return Promise.reject(err);
      });
  } catch (err) {
    console.log('Error playing start music:', err);
    return Promise.reject(err);
  }
};

// Improved stop start music function
export const stopStartMusic = () => {
  try {
    console.log('Stopping start music');
    if (!audioFiles.start) {
      console.log('Start music reference not found');
      return false;
    }
    
    // Force stop the music
    audioFiles.start.pause();
    audioFiles.start.currentTime = 0;
    
    // Reset the audio to break any existing references/states
    audioFiles.start = new Audio(process.env.PUBLIC_URL + '/assets/sound/start.mp3');
    audioFiles.start.loop = true;
    audioFiles.start.load();
    
    return true;
  } catch (err) {
    console.log('Error stopping music:', err);
    return false;
  }
};

// Ambient casino music for gameplay
export const playAmbientMusic = () => {
  try {
    // Make sure start music is stopped first
    stopStartMusic();
    
    console.log('Starting ambient casino music');
    audioFiles.ambient.currentTime = 0;
    audioFiles.ambient.volume = 0.7; // Slightly lower volume for background
    
    return audioFiles.ambient.play()
      .catch(err => {
        console.log('Ambient music play error:', err);
        
        // Set up a one-time click listener for autoplay policies
        const playOnInteraction = () => {
          audioFiles.ambient.play()
            .then(() => console.log('Ambient music started after user interaction'))
            .catch(e => console.log('Still failed to play ambient:', e));
          document.removeEventListener('click', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction, {once: true});
        
        return Promise.reject(err);
      });
  } catch (err) {
    console.log('Error starting ambient music:', err);
    return Promise.reject(err);
  }
};

// Stop ambient music
export const stopAmbientMusic = () => {
  try {
    console.log('Stopping ambient music');
    if (!audioFiles.ambient) {
      console.log('Ambient music reference not found');
      return false;
    }
    
    audioFiles.ambient.pause();
    audioFiles.ambient.currentTime = 0;
    
    // Reset the audio to break any existing references/states
    audioFiles.ambient = new Audio(process.env.PUBLIC_URL + '/assets/sound/ambient.mp3');
    audioFiles.ambient.loop = true;
    audioFiles.ambient.load();
    
    return true;
  } catch (err) {
    console.log('Error stopping ambient music:', err);
    return false;
  }
};