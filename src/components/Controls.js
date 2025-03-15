import React from 'react';
import { motion } from 'framer-motion';

function Controls({ player, currentStake, onPlayerAction, currentCycle, activePlayersCount }) {
  const activeCount = activePlayersCount || 3;
  const buttons = [];
  
  // Only render controls for human player
  if (!player.isHuman) return null;
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 0px 15px rgba(212, 175, 55, 0.5)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }
    },
    tap: { scale: 0.95 }
  };
  
  // If human player is blind, show blind options (after AI turns)
  if (player.mode === "blind") {
    buttons.push(
      { 
        label: `Blind Turn (-${currentStake})`, 
        action: () => onPlayerAction('blind'),
        style: "royal-btn-green",
        icon: "♣"
      },
      { 
        label: `Reveal & Continue (-${2 * currentStake})`, 
        action: () => onPlayerAction('seen'),
        style: "royal-btn-blue",
        icon: "♠"
      },
      { 
        label: 'Forfeit', 
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
          label: `Continue (-${2 * currentStake})`, 
          action: () => onPlayerAction('seen'),
          style: "royal-btn-blue",
          icon: "♠"
        },
        { 
          label: 'Forfeit', 
          action: () => onPlayerAction('fold'),
          style: "royal-btn-red",
          icon: "♦"
        }
      );
    } else {
      buttons.push(
        { 
          label: `Continue (-${2 * currentStake})`, 
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
          label: 'Forfeit', 
          action: () => onPlayerAction('fold'),
          style: "royal-btn-red",
          icon: "♦"
        }
      );
    }
  }
  
  return (
    <div className="mt-6 flex justify-center space-x-4">
      {buttons.map((b, idx) => (
        <motion.button
          key={idx}
          onClick={b.action}
          className={`px-4 py-3 rounded-lg text-white transition-all duration-200 ${b.style}`}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <span className="mr-2">{b.icon}</span>
          {b.label}
          <span className="ml-2">{b.icon}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default Controls;