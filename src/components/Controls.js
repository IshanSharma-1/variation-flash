import React from 'react';
import { motion } from 'framer-motion';

function Controls({ player, currentStake, onPlayerAction, currentCycle, activePlayersCount, isSmallScreen }) {
  const activeCount = activePlayersCount || 3;
  const buttons = [];
  
  // Only render controls for human player
  if (!player?.isHuman) return null;
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: isSmallScreen ? 1.03 : 1.05, // Smaller hover effect on mobile
      boxShadow: "0px 0px 15px rgba(212, 175, 55, 0.5)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: isSmallScreen ? 20 : 15 // More damping on mobile for quicker feedback
      }
    },
    tap: { scale: 0.97 }
  };
  
  // If human player is blind, show blind options (after AI turns)
  if (player.mode === "blind") {
    buttons.push(
      { 
        label: isSmallScreen ? `Blind (-${currentStake})` : `Blind Turn (-${currentStake})`, 
        action: () => onPlayerAction('blind'),
        style: "royal-btn-green",
        icon: "♣"
      },
      { 
        label: isSmallScreen ? `Reveal (-${2 * currentStake})` : `Reveal & Continue (-${2 * currentStake})`, 
        action: () => onPlayerAction('seen'),
        style: "royal-btn-blue",
        icon: "♠"
      },
      { 
        label: 'Fold', 
        action: () => onPlayerAction('fold'),
        style: "royal-btn-red",
        icon: "♦"
      }
    );
  } else {
    // If human player is seen
    if (activeCount > 2) {
      buttons.push(
        { 
          label: `Play (-${2 * currentStake})`, 
          action: () => onPlayerAction('seen'),
          style: "royal-btn-blue",
          icon: "♠"
        },
        { 
          label: 'Fold', 
          action: () => onPlayerAction('fold'),
          style: "royal-btn-red",
          icon: "♦"
        }
      );
    } else {
      buttons.push(
        { 
          label: `Play (-${2 * currentStake})`, 
          action: () => onPlayerAction('seen'),
          style: "royal-btn-blue",
          icon: "♠"
        },
        { 
          label: `Show (-${2 * currentStake})`, 
          action: () => onPlayerAction('show'),
          style: "royal-btn-purple",
          icon: "♥"
        },
        { 
          label: 'Fold', 
          action: () => onPlayerAction('fold'),
          style: "royal-btn-red",
          icon: "♦"
        }
      );
    }
  }
  
  return (
    <div className={`mt-4 md:mt-6 flex ${isSmallScreen ? 'flex-col space-y-3' : 'justify-center space-x-4'}`}>
      {buttons.map((b, idx) => (
        <motion.button
          key={idx}
          onClick={b.action}
          className={`px-3 md:px-4 py-3 rounded-lg text-white text-sm md:text-base transition-all duration-200 ${b.style}`}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          // Improve touch handling
          style={{ touchAction: "manipulation" }}
        >
          <span className="mr-1 md:mr-2">{b.icon}</span>
          {b.label}
          {!isSmallScreen && <span className="ml-2">{b.icon}</span>}
        </motion.button>
      ))}
    </div>
  );
}

export default Controls;