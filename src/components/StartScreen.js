import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameManual from './GameManual'; // We'll create this component next
import { playStartMusic, stopStartMusic } from '../utils/AudioManager';

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

// Global interaction tracker
let hasUserInteracted = false;

function StartScreen({ onStart }) {
  const [showManual, setShowManual] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // Add missing state for music playing
  const [explosionTrigger, setExplosionTrigger] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });


  // Handle audio during state transitions
  useEffect(() => {
    // Simple play attempt when component mounts
    const attemptPlayMusic = async () => {
      try {
        await playStartMusic();
        setIsMusicPlaying(true);
      } catch (error) {
        console.log('Initial music play failed, waiting for user interaction');
        
        // Set up a one-time listener for first interaction
        const handleInteraction = () => {
          playStartMusic()
            .then(() => setIsMusicPlaying(true))
            .catch(err => console.log('Still failed to play music:', err));
          
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
        };
        
        document.addEventListener('click', handleInteraction, {once: true});
        document.addEventListener('touchstart', handleInteraction, {once: true});
      }
    };
    
    attemptPlayMusic();
    
    // Clean up on unmount
    return () => {
      if (isMusicPlaying) {
        stopStartMusic();
      }
    };
  }, [isMusicPlaying]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle navigation and stop music safely
  const handleStart = () => {
    try {
      console.log('Start button clicked, stopping music...');
      stopStartMusic(); // This should completely stop the music
    } catch (error) {
      console.log('Error stopping music:', error);
    }
    
    // Navigate immediately - no need for a timeout
    onStart();
  };

  // State for dynamic background colors
  const [backgroundColors, setBackgroundColors] = useState({
    from: 'hsl(330, 50%, 8%)',
    mid: 'hsl(260, 50%, 12%)',
    to: 'hsl(220, 50%, 8%)'
  });
  
  // MODIFIED SUIT EXPLOSION EFFECT - BOTTOM TO TOP BURST
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
      boxShadow: "0px 0px 25px rgba(212, 175, 55, 0.8)",
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
        className="text-center p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        onClick={() => setExplosionTrigger(prev => prev + 1)} // Trigger explosion on click
      >
        {/* Title with shine effect */}
        <motion.h1 
          className="font-extrabold mb-8 tracking-wide royal-text"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="block text-5xl" style={{
            background: "linear-gradient(to right, #d4af37 10%, #fcb69f 40%, #d4af37 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shine 3s linear infinite"
          }}>Variation</span>
          <span className="block mt-3 text-7xl" style={{
            background: "linear-gradient(to right, #d4af37 10%, #ffffff 30%, #d4af37 50%, #ffffff 70%, #d4af37 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shine 5s linear infinite",
            textShadow: "0 0 20px rgba(255,255,255,0.2)"
          }}>Flash</span>
        </motion.h1>
        
        {/* Main Play Button */}
        <motion.button
          onClick={handleStart}
          className="btn btn-primary btn-gold-accent w-full text-xl mt-6 btn-ripple"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <span className="relative z-10 text-white">PLAY NOW</span>
        </motion.button>

        {/* Game Manual Button */}
        <motion.button
          onClick={() => setShowManual(true)}
          className="btn btn-secondary btn-gold-accent w-full text-lg mt-4 btn-ripple"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <span className="card-suit suit-spade mr-2">♠</span>
          <span className="relative z-10 text-white">GAME GUIDE</span>
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
      
      {/* Game Manual Modal */}
      <AnimatePresence>
        {showManual && (
          <GameManual onClose={() => setShowManual(false)} />
        )}
      </AnimatePresence>
      
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