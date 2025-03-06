import React from 'react';
import { CARD_IMAGES } from '../utils/constants';

function Player({ player, currentPlayer, flipCard, handleDragStart }) {
  return (
    <div className={`player ${currentPlayer === player.id ? 'current' : ''}`}>
      <h3>{player.name}</h3>
      <div>
        {player.cards.map((card, index) => (
          <div
            key={index}
            className={`card ${card.flipped ? 'card-front' : 'card-back'}`}
            style={{ backgroundImage: card.flipped ? `url(${CARD_IMAGES[`${card.value}-${card.suit}`]})` : 'url(/assets/cards/card-back.png)' }}
            onClick={() => flipCard(player.id, index)}
            draggable
            onDragStart={(e) => handleDragStart(e, card)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Player;