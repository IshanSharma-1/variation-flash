import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Card suit symbols for explosion effect
const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

// Colors for each suit
const suitColors = {
  hearts: '#ff5555',
  diamonds: '#ff5555',
  clubs: '#ffffff',
  spades: '#ffffff'
};

function StartScreen({ onStart }) {
  // Fix #1: Use window dimensions state to handle window resizing
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Fix #2: Improve audio with better initialization and error handling
  useEffect(() => {
    // Create a proper audio context and element
    const audioElement = new Audio();
    audioElement.src = process.env.PUBLIC_URL + '/assets/bg/start.mp3';
    audioElement.loop = true;
    audioElement.volume = 1.0; // Full volume
    audioElement.preload = 'auto';
    
    // Check if audio is loaded
    audioElement.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and ready to play');
    });
    
    // Error handling
    audioElement.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      console.error('Audio error code:', audioElement.error?.code);
      console.error('Audio src:', audioElement.src);
    });
    
    // Function to play audio with better user interaction handling
    const playAudio = () => {
      console.log('Attempting to play audio...');
      const playPromise = audioElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playback started successfully');
          })
          .catch(error => {
            console.warn('Auto-play was prevented:', error);
            
            // Create a visible play button for user interaction
            const playButton = document.createElement('button');
            playButton.innerHTML = '🔊 Enable Sound';
            playButton.style.position = 'fixed';
            playButton.style.bottom = '20px';
            playButton.style.right = '20px';
            playButton.style.zIndex = '9999';
            playButton.style.padding = '10px 15px';
            playButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
            playButton.style.color = 'white';
            playButton.style.border = 'none';
            playButton.style.borderRadius = '5px';
            playButton.style.cursor = 'pointer';
            
            playButton.onclick = () => {
              audioElement.play()
                .then(() => {
                  document.body.removeChild(playButton);
                })
                .catch(e => console.error('Still cannot play audio:', e));
            };
            
            document.body.appendChild(playButton);
          });
      }
    };
    
    // Try to play immediately
    playAudio();
    
    // Also play on user interaction
    const handleUserInteraction = () => {
      playAudio();
      // Remove the event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    // Fix #1: Update window dimensions on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      audioElement.pause();
      audioElement.src = '';
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // State for dynamic background colors
  const [backgroundColors, setBackgroundColors] = useState({
    from: 'hsl(330, 50%, 8%)',
    mid: 'hsl(260, 50%, 12%)',
    to: 'hsl(220, 50%, 8%)'
  });
  
  // MODIFIED SUIT EXPLOSION EFFECT - BOTTOM TO TOP BURST
  const [explosionTrigger, setExplosionTrigger] = useState(0);
  const suitParticles = useMemo(() => {
    // Define screen dimensions
    const { width, height } = windowSize;
    
    // Create suit particles that burst from bottom to top
    return Array.from({ length: 80 }, (_, i) => {
      // Determine which suit to use (distribute evenly)
      const suitType = Object.keys(suitSymbols)[i % 4];
      
      // Random starting position along the bottom of the screen
      const startX = Math.random() * width;
      const startY = height + 20; // Start just below the visible screen
      
      // Random angle pointing upward (between 45° and 135°)
      const angle = (Math.PI / 4) + (Math.random() * Math.PI / 2);
      
      // Random distance to travel
      const distance = height * (0.7 + Math.random() * 0.6);
      
      // Calculate end position based on angle and distance
      const endX = startX + Math.cos(angle) * distance;
      const endY = startY - Math.sin(angle) * distance;
      
      return {
        suit: suitType,
        symbol: suitSymbols[suitType],
        color: suitColors[suitType],
        startX,
        startY,
        endX,
        endY,
        size: 15 + Math.random() * 25,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 1.5,
        rotation: Math.random() * 720 - 360,
        opacity: 0.7 + Math.random() * 0.3,
      };
    });
  }, [explosionTrigger, windowSize]);

  // Make explosions more continuous - trigger more frequently
  useEffect(() => {
    const interval = setInterval(() => {
      setExplosionTrigger(prev => prev + 1);
    }, 2000); // More frequent bursts every 2 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Effect for changing background colors with more seamless transitions
  useEffect(() => {
    let currentHue = 330;
    let targetHue = 260;
    
    const transitionSpeed = 0.2; // Lower = smoother but slower transitions
    
    const interval = setInterval(() => {
      // Smoothly transition current hue towards target
      if (Math.abs(currentHue - targetHue) > 0.5) {
        currentHue = currentHue + (targetHue - currentHue) * transitionSpeed;
        
        // Calculate complementary hues for mid and end colors
        const midHue = (currentHue + 40) % 360;
        const endHue = (currentHue + 80) % 360;
        
        setBackgroundColors({
          from: `hsl(${currentHue}, 50%, 8%)`,
          mid: `hsl(${midHue}, 50%, 12%)`,
          to: `hsl(${endHue}, 50%, 8%)`
        });
      } else {
        // Set new random target hue when close enough
        targetHue = Math.random() > 0.5
          ? Math.floor(Math.random() * 60) + 300 // Purple to red (wine colors)
          : Math.floor(Math.random() * 30) + 0;  // Red to orange
      }
    }, 100); // Update more frequently for smoother transition
    
    return () => clearInterval(interval);
  }, []);

  // Button and text animations
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.2, 
        ease: "easeOut" 
      }
    }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 0px 25px rgba(255, 215, 0, 0.8)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, ${backgroundColors.from}, ${backgroundColors.mid} 50%, ${backgroundColors.to})`,
        transition: "background 0.2s linear"
      }}
    >
      {/* CARD SUIT EXPLOSION EFFECT - FROM ALL FOUR CORNERS */}
      <AnimatePresence>
        {suitParticles.map((particle, index) => (
          <motion.div
            key={`suit-${explosionTrigger}-${index}`}
            className="absolute"
            style={{
              color: particle.color,
              fontSize: `${particle.size}px`,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${particle.color}`,
              zIndex: 5,
              transformOrigin: 'center center'
            }}
            initial={{ 
              x: particle.startX,
              y: particle.startY,
              opacity: 0,
              scale: 0.2,
              rotate: 0 
            }}
            animate={{ 
              x: particle.endX,
              y: particle.endY,
              opacity: [0, particle.opacity, 0],
              scale: [0.2, 1, 0.5],
              rotate: particle.rotation
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut" 
            }}
          >
            {particle.symbol}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Invisible container with aquamorphic effect */}
      <motion.div 
        className="w-11/12 md:w-96 text-center p-10 relative z-20 rounded-xl"
        style={{
          backgroundColor: "rgba(30, 0, 20, 0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onClick={() => setExplosionTrigger(prev => prev + 1)} // Trigger explosion on click
      >
        {/* Title with shine effect */}
        <motion.h1 
          className="font-extrabold mb-8 tracking-wide"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="block text-5xl" style={{
            background: "linear-gradient(to right, #ffecd2 10%, #fcb69f 40%, #ffecd2 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shine 3s linear infinite"
          }}>THE</span>
          <span className="block mt-3 text-7xl" style={{
            background: "linear-gradient(to right, #ffefba 10%, #ffffff 30%, #ffefba 50%, #ffffff 70%, #ffefba 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shine 5s linear infinite",
            textShadow: "0 0 20px rgba(255,255,255,0.2)"
          }}>ROYAL</span>
          <span className="block mt-3 text-6xl" style={{
            background: "linear-gradient(to right, #ffecd2 10%, #fcb69f 40%, #ffecd2 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shine 3s linear infinite"
          }}>DEAL</span>
        </motion.h1>
        
        {/* Enhanced play button */}
        <motion.button
          onClick={onStart}
          className="px-12 py-4 text-2xl font-semibold rounded-full relative overflow-hidden mt-6"
          style={{
            background: "linear-gradient(to right, #603813, #b29f94)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
          }}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.span 
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(to right, rgba(255,215,0,0.5), rgba(139,69,19,0.3))",
                "linear-gradient(to right, rgba(139,69,19,0.3), rgba(255,215,0,0.5))",
                "linear-gradient(to right, rgba(255,215,0,0.5), rgba(139,69,19,0.3))"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.span 
            className="absolute inset-0 opacity-60"
            animate={{ 
              x: ["-100%", "100%"],
              transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
            }}
          />
          <span className="relative z-10 text-white">PLAY NOW</span>
        </motion.button>

        {/* Version tag */}
        <motion.p 
          className="absolute bottom-2 right-3 text-xs opacity-70"
          style={{ color: "rgba(255,255,255,0.6)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          v1.0
        </motion.p>
      </motion.div>

      {/* Light effects in the background - STATIC FOR PERFORMANCE */}
      <div 
        className="absolute rounded-full"
        style={{ 
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(128,0,32,0.08) 0%, rgba(128,0,32,0) 70%)",
          zIndex: 5,
          top: "10%",
          right: "10%",
          filter: "blur(40px)"
        }}
      />

      <div 
        className="absolute rounded-full"
        style={{ 
          width: "30vw",
          height: "30vw",
          background: "radial-gradient(circle, rgba(70,0,90,0.05) 0%, rgba(70,0,90,0) 70%)",
          zIndex: 5,
          bottom: "15%",
          left: "5%",
          filter: "blur(40px)"
        }}
      />
      
      {/* Fix for the JSX attribute warning */}
      <style>
        {`
        @keyframes shine {
          from { background-position: 0% center; }
          to { background-position: 200% center; }
        }
        `}
      </style>
    </div>
  );
}

export default StartScreen;