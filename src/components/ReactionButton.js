import React, { useState } from "react";
import { motion } from "framer-motion";
import { Twemoji } from "react-emoji-render"; // Changed from Emoji to Twemoji

const MAX_FLOATING_EMOJIS = 30; // Increased limit

function ReactionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Enhanced emoji collection with more visually appealing options
  const emojis = [
    "😍", // heart_eyes
    "😂", // joy
    "👏", // clap
    "🔥", // fire
    "🎉", // tada
    "💯", // 100
    "👑", // crown
    "✨", // sparkles
    "🌟", // star2
    "😎"  // sunglasses
  ];

  const toggleOpen = () => setIsOpen(!isOpen);
  const closeReactions = () => setIsOpen(false);

  const addFloatingEmoji = (emoji) => {
    setFloatingEmojis((prev) => {
      if (prev.length >= MAX_FLOATING_EMOJIS) return prev;
      const id = Date.now() + Math.random();
      return [...prev, { id, emoji }];
    });
  };

  const removeFloatingEmoji = (id) => {
    setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        😃
      </button>

      {isOpen && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 w-64 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Reactions</h3>
            <button
              onClick={closeReactions}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addFloatingEmoji(emoji)}
                className="text-2xl hover:scale-125 transition-transform duration-200"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-40">
        {floatingEmojis.map(({ id, emoji }) => (
          <FloatingEmoji
            key={id}
            emoji={emoji}
            onComplete={() => removeFloatingEmoji(id)}
          />
        ))}
      </div>
    </div>
  );
}

function FloatingEmoji({ emoji, onComplete }) {
  // Small horizontal variation but no rotation
  const smallXOffset = -30 + Math.random() * 60;
  
  const variants = {
    initial: { 
      opacity: 0, 
      y: 100, 
      x: smallXOffset,
      scale: 0.8
    },
    animate: {
      opacity: [0, 1, 0],
      y: -window.innerHeight - 100,
      x: smallXOffset, // Keep horizontal position stable
      scale: [0.8, 1, 0.8] // Small scale animation
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ 
        duration: 1.8 + Math.random() * 0.5, 
        ease: "easeOut" 
      }}
      onAnimationComplete={onComplete}
      className="absolute bottom-0 left-1/2 text-3xl" // Use smaller text size
      style={{ transform: "translateX(-50%)" }}
    >
      {emoji}
    </motion.div>
  );
}

export default ReactionButton;