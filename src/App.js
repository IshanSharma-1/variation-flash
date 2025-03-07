import React, { useState } from 'react';
import TitleScreen from './components/TitleScreen';
import RoomCreation from './components/RoomCreation';
import VariationSelection from './components/VariationSelection';
import GameLayout from './components/GameLayout';

function App() {
  const [screen, setScreen] = useState('title');
  const [roomCode, setRoomCode] = useState('');
  const [variation, setVariation] = useState('Normal');
  // For demo purposes, we'll use static player data.
  const [players, setPlayers] = useState([
    { name: 'Alice', coins: 50 },
    { name: 'Bob', coins: 50 },
    { name: 'Charlie', coins: 50 },
    { name: 'Dave', coins: 50 }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      {screen === 'title' && <TitleScreen onPlay={() => setScreen('room')} />}
      {screen === 'room' && (
        <RoomCreation 
          onRoomCreated={(code) => { setRoomCode(code); setScreen('variation'); }}
        />
      )}
      {screen === 'variation' && (
        <VariationSelection 
          onVariationSelected={(v) => { setVariation(v); setScreen('game'); }}
        />
      )}
      {screen === 'game' && (
        <GameLayout roomCode={roomCode} variation={variation} players={players} />
      )}
    </div>
  );
}

export default App;