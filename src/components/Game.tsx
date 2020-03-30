import React, { useState, useEffect } from 'react';
import { getImages } from '../logic/giphy-api';
import { shuffle } from '../logic/shuffler';
import { GameCard, CardState } from '../models/game-card';
import { Card } from './Card';
import { delay } from '../logic/delay';
import styled from 'styled-components';

interface GameDiv {
  columnCount: number;
}

interface GameProps {
  search: string;
  cardCount: number;
  ezMode: boolean;
}

const GamePanel = styled.div<GameDiv>`
  display: grid;
  grid-template-columns: repeat(${props => props.columnCount}, 200px);
  grid-gap: 6px;
  margin: 6px;
  justify-content: center;
`;

export const Game = ({ search, cardCount, ezMode }: GameProps) => {
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [cards, setCards] = useState<GameCard[]>([]);

  useEffect(() => {
    setLoading(true);

    getImages(search, cardCount / 2)
      .then(response => delay(1000, response))
      .then(response => {
        const results = response.data.map(gd => {
          return {
            image: gd.images.fixed_height,
            pairId: gd.id
          };
        });

        let indices = Array.from({ length: cardCount }, (_, k) =>
          Math.floor(k / 2)
        );
        indices = shuffle(indices);

        const newCards = indices.map((pairIndex, cardIndex) => {
          const result = results[pairIndex];
          const gameCard: GameCard = {
            cardId: cardIndex,
            ezMode: ezMode,
            pairId: result.pairId,
            state: 'hidden',
            image: result.image
          };
          return gameCard;
        });

        setLoading(false);
        setCards(newCards);
      });
  }, [search, cardCount, ezMode]);

  const renderLoading = () => {
    return <div>Loading...</div>;
  };

  const renderLoaded = (results: GameCard[]): JSX.Element => {
    return results.length === 0 ? renderEmpty() : renderFilled(results);
  };

  const renderEmpty = () => {
    return <div>No results</div>;
  };

  const renderFilled = (results: GameCard[]): JSX.Element => {
    return (
      <>
        <GamePanel columnCount={computeGrid(cardCount).columns}>
          {results.map(card => (
            <Card
              key={card.cardId}
              gameCard={card}
              onClick={() => handleCardClicked(card.cardId)}
            />
          ))}
        </GamePanel>
      </>
    );
  };

  const handleCardClicked = (cardId: number) => {
    if (blocked) {
      return;
    }

    const previousCard = cards.find(c => {
      return c.state === 'revealed';
    });

    if (!previousCard) {
      setCards(getUpdatedCards(cards, 'revealed', [cardId]));
      return;
    }

    const card = cards[cardId];

    if (previousCard === card) {
      return;
    }

    previousCard.pairId === card.pairId
      ? matchCards(previousCard.cardId, card.cardId)
      : hideCards(previousCard.cardId, card.cardId);
  };

  const matchCards = (...cardIds: number[]) => {
    const updatedCards = getUpdatedCards(cards, 'matched', cardIds);
    setCards(updatedCards);
  };

  const hideCards = (...cardIds: number[]) => {
    setBlocked(true);
    const updatedCards = getUpdatedCards(cards, 'revealed', cardIds);
    setCards(updatedCards);

    setTimeout(() => {
      const updatedCards = getUpdatedCards(cards, 'hidden', cardIds);
      setCards(updatedCards);
      setBlocked(false);
    }, 1000);
  };

  return <div>{loading ? renderLoading() : renderLoaded(cards)}</div>;
};

function getUpdatedCards(
  cards: GameCard[],
  nextState: CardState,
  cardsToUpdate: number[]
) {
  return cards.map(c => {
    if (!cardsToUpdate.includes(c.cardId)) {
      return c;
    }
    return {
      ...c,
      state: nextState
    };
  });
}

function computeGrid(cellCount: number) {
  var columns = Math.floor(Math.sqrt(cellCount));
  var rows = cellCount / columns;
  return {
    columns,
    rows
  };
}
