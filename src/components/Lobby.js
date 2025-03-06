import React, { useState } from 'react';

const Lobby = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);

  const addPlayer = () => {
    if (playerName.trim() === "") return;
    // Add new player with default coin balance and blind properties.
    setPlayers([...players, { name: playerName, coins: 50, active: true }]);
    setPlayerName("");
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Lobby</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
        className="border p-2 w-full mb-4"
      />
      <button 
        onClick={addPlayer} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full">
        Join Lobby
      </button>
      <div>
        <h2 className="font-bold mb-2">Players in Lobby:</h2>
        <ul>
          {players.map((p, index) => (
            <li key={index} className="border p-2 my-1">{p.name}</li>
          ))}
        </ul>
      </div>
      {players.length > 0 && (
        <button 
          onClick={() => onStartGame(players)} 
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full">
          Start Game
        </button>
      )}
    </div>
  );
};

export default Lobby;
