import React from 'react';

const TitleScreen = ({ onPlay }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg text-yellow-400">
        Teen Patti Casino
      </h1>
      <button 
        onClick={onPlay}
        className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 transition rounded-full text-2xl font-bold shadow-lg">
        Play Now
      </button>
    </div>
  );
};

export default TitleScreen;