import React, { useState } from 'react';

const VariationSelection = ({ onVariationSelected }) => {
  const variations = ['Normal', '3 in Muflis', '4 in Muflis', 'Kiss Miss & Jump'];
  const [selected, setSelected] = useState('Normal');

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h2 className="text-3xl font-bold">Select Variation</h2>
      <div className="flex flex-col space-y-2">
        {variations.map((v, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="variation" 
              value={v} 
              checked={selected === v} 
              onChange={() => setSelected(v)}
              className="accent-yellow-500"
            />
            <span className="text-xl">{v}</span>
          </label>
        ))}
      </div>
      <button 
        onClick={() => onVariationSelected(selected)}
        className="px-6 py-3 bg-green-600 hover:bg-green-500 transition rounded-full text-xl font-bold shadow">
        Continue to Game
      </button>
    </div>
  );
};

export default VariationSelection;