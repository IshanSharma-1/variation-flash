import React from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function WelcomeScreen() {
  const history = useHistory();

  const createRoom = () => {
    const roomId = uuidv4();
    history.push(`/room/${roomId}`);
  };

  return (
    <div className="welcome-screen">
      <h1>Welcome to Uno Game</h1>
      <button onClick={createRoom}>Create Room</button>
      <div className="ad-banner">Your Ad Here</div>
    </div>
  );
}

export default WelcomeScreen;