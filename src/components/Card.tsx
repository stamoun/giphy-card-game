import React from 'react';
import { GameCard } from '../models/game-card';
import styled from 'styled-components';

interface CardProps {
  gameCard: GameCard;
  color: string;
  displayId: boolean;
  onClick: () => void;
}

interface CardUIButton {
  backgroundColor: string;
}

const CardUI = styled.button<CardUIButton>`
  background: none;
  cursor: pointer;
  display: flex;
  border: 1px solid black;
  width: 200px;
  height: 200px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  ${props => props.backgroundColor}

  &:focus {
    outline: none;
    border: 2px solid black;
  }

  &:hover {
    opacity: 0.8;
  }
  > img {
    width: 100%;
  }
`;

export const Card = ({ gameCard, color, displayId, onClick }: CardProps) => {
  const isContentVisible = gameCard.state !== 'hidden';

  return (
    <CardUI onClick={onClick} backgroundColor={color}>
      {isContentVisible
        ? renderCardContent(gameCard.image.url)
        : displayId
        ? gameCard.pairId
        : ''}
    </CardUI>
  );
};

function renderCardContent(imgSrc: string) {
  return <img alt="Card" src={imgSrc} />;
}
