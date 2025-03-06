import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Room() {
  const { roomId } = useParams();
  const history = useHistory();
  const [name, setName] = useState('');

  const joinRoom = () => {
    socket.emit('joinRoom', { roomId, name });
    history.push(`/game/${roomId}`);
  };

  return (
    <div className="room">
      <h1>Room ID: {roomId}</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default Room;