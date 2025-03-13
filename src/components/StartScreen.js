import React from 'react';

function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* NEW UPDATE: Wrap content in aquamorphic-bg container */}
      <div className="aquamorphic-bg w-96 text-center">
        <h1 className="text-6xl font-extrabold mb-10 text-yellow-400 tracking-wide">
          VARIATION FLASH
        </h1>
        <button
          onClick={onStart}
          className="bg-blue-600 text-white px-10 py-4 rounded-full text-2xl font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Start Now
        </button>
      </div>
    </div>
  );
}

export default StartScreen;