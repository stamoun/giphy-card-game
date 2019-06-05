import React from "react";
import { GameCard } from "../models/game-card";
import cardStyles from "./Card.module.scss";

export interface CardProps {
  gameCard: GameCard;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = props => {
  const { gameCard, onClick } = props;
  const isContentVisible = gameCard.state !== "hidden";

  return (
    <div
      className={`${cardStyles.card} ${cardStyles[gameCard.state]}`}
      onClick={onClick}
    >
      {isContentVisible
        ? renderCardContent(gameCard.image.url)
        : gameCard.pairId}
    </div>
  );
};

function renderCardContent(imgSrc: string) {
  return <img alt="Card" src={imgSrc} />;
}
