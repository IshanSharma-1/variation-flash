import React from 'react';

function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      {/* Animated subtle glow particles */}
      <div
        className="absolute w-4 h-4 bg-yellow-300 rounded-full"
        style={{
          top: '20%',
          left: '40%',
          animation: 'glitter 3s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-3 h-3 bg-orange-300 rounded-full"
        style={{
          top: '60%',
          left: '70%',
          animation: 'glitter 4s ease-in-out infinite',
        }}
      />

      {/* Main container with glass effect */}
      <div className="glassmorphic-bg w-96 text-center p-8">
        <h1 className="text-6xl font-extrabold mb-8 gold-gradient-text tracking-wide">
          VARIATION FLASH
        </h1>
        <button
          onClick={onStart}
          className="px-10 py-4 text-2xl font-semibold rounded-full bg-green-800 hover:bg-green-700 golden-hover transition duration-300 shadow-lg text-white"
        >
          Start Now
        </button>
      </div>
    </div>
  );
}

export default StartScreen;