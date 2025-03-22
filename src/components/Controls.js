import React from 'react';
import { motion } from 'framer-motion';

function Controls({ player, currentStake, onPlayerAction, currentCycle, activePlayersCount, isSmallScreen }) {
  const activeCount = activePlayersCount || 3;
  const buttons = [];
  
  // Only render controls for human player
  if (!player?.isHuman) return null;
  
  // Updated button variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
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
          className={`btn ${
            b.style === "royal-btn-green" ? "btn-success" :
            b.style === "royal-btn-blue" ? "btn-secondary" :
            b.style === "royal-btn-red" ? "btn-danger" :
            b.style === "royal-btn-purple" ? "btn-royal" :
            "btn-primary"
          } btn-gold-accent text-sm md:text-base btn-ripple`}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
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