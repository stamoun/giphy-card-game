import React from "react";
import { GameCard } from "../models/game-card";
import styled from "styled-components";

interface CardProps {
  gameCard: GameCard;
  onClick: () => void;
}

interface CardUIButton {
  cardState: string;
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

  &:focus {
    outline: none;
    border: 2px solid black;
  }

  ${props =>
    props.cardState === "revealed"
      ? `background-color: bisque;`
      : props.cardState === "matched"
      ? `background-color: pink;`
      : `background-color: darksalmon;

    &:hover {
      opacity: 0.8;
    }
  `}

  > img {
    width: 100%;
  }
`;

export const Card = ({ gameCard, onClick }: CardProps) => {
  const isContentVisible = gameCard.state !== "hidden";

  return (
    <CardUI onClick={onClick} cardState={gameCard.state}>
      {isContentVisible
        ? renderCardContent(gameCard.image.url)
        : gameCard.pairId}
    </CardUI>
  );
};

function renderCardContent(imgSrc: string) {
  return <img alt="Card" src={imgSrc} />;
}
