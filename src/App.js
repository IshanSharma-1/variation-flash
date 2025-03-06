import React, { useState } from 'react';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';

function App() {
  // Initially, no players have joined.
  const [players, setPlayers] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {!players ? (
        <Lobby onStartGame={(playerList) => setPlayers(playerList)} />
      ) : (
        <GameBoard players={players} />
      )}
    </div>
  );
}

export default App;
