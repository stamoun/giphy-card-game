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
}

const GamePanel = styled.div<GameDiv>`
  display: grid;
  grid-template-columns: repeat(${props => props.columnCount}, 200px);
  grid-gap: 6px;
  margin: 6px;
  justify-content: center;
`;

const EZ_MODES = ['off', 'colors', 'id'];

export const Game = ({ search, cardCount }: GameProps) => {
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [ezMode, setEzMode] = useState('off');

  useEffect(() => {
    setLoading(true);

    getImages(search, cardCount / 2)
      .then(response => delay(1000, response))
      .then(response => {
        let index = 0;
        const results = response.data.map(gd => {
          return {
            image: gd.images.fixed_height,
            pairId: index++
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
            pairId: result.pairId,
            state: 'hidden',
            image: result.image
          };
          return gameCard;
        });

        setLoading(false);
        setCards(newCards);
      });
  }, [search, cardCount]);

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
        <label>
          EZ Mode:
          <select value={ezMode} onChange={handleEzModeChange}>
            {EZ_MODES.map(s => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <GamePanel columnCount={computeGrid(cardCount).columns}>
          {results.map(card => (
            <Card
              key={card.cardId}
              gameCard={card}
              color={getCardColor(
                cardCount / 2,
                card.pairId,
                card.state,
                ezMode
              )}
              displayId={ezMode === 'id'}
              onClick={() => handleCardClicked(card.cardId)}
            />
          ))}
        </GamePanel>
      </>
    );
  };

  const getCardColor = (
    bracketsCount: number,
    pairId: number,
    cardState: string,
    ezMode: string
  ) => {
    const value = Math.floor((256 / bracketsCount) * (pairId + 1));
    const ezModeColor = `hsl(${value}, 100%, 50%)`;

    console.log(`color: ${ezModeColor}`);

    const color =
      cardState === 'revealed'
        ? 'bisque'
        : cardState === 'matched'
        ? 'pink'
        : ezMode === 'colors'
        ? ezModeColor
        : 'darksalmon';

    const backgroundColor = `background-color: ${color};`;

    return backgroundColor;
  };

  const handleEzModeChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setEzMode(e.currentTarget.value);
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
