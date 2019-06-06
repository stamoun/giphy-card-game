import React from "react";
import { getImage } from "../logic/giphy-api";
import { shuffle } from "../logic/shuffler";
import { GameCard } from "../models/game-card";
import { Card } from "./Card";
import { delay } from "../logic/delay";
import styled from "styled-components";

interface GameState {
  loading: boolean;
  cards: GameCard[];
}

const Panel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-gap: 6px;
  margin: 6px;
  justify-content: center;
`;

export class Game extends React.Component<
  { search: string; limit: number },
  GameState
> {
  search: any;
  limit: any;
  constructor(props: any) {
    super(props);
    this.search = props.search;
    this.limit = props.limit;
    this.state = {
      loading: false,
      cards: []
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });

    getImage(this.props.search, this.limit)
      .then(response => delay(1000, response))
      .then(response => {
        const results = response.data.map(gd => {
          return {
            image: gd.images.fixed_height,
            pairId: gd.id
          };
        });

        let indices = Array.from({ length: results.length * 2 }, (_, k) =>
          Math.floor(k / 2)
        );
        indices = shuffle(indices);

        const cards = indices.map((pairIndex, cardIndex) => {
          const result = results[pairIndex];

          const gameCard: GameCard = {
            cardId: cardIndex,
            pairId: result.pairId,
            state: "hidden",
            image: result.image
          };

          return gameCard;
        });

        this.setState(state => ({
          ...state,
          loading: false,
          cards
        }));
      });
  }

  handleCardClicked(cardId: number) {
    const previousCard = this.state.cards.find(c => {
      return c.state === "revealed";
    });

    const card = this.state.cards[cardId];
    if (!previousCard) {
      this.setCardState("revealed", cardId);
      return;
    }

    if (previousCard.cardId === cardId) {
      return;
    }

    if (previousCard.pairId === card.pairId) {
      this.setCardState("matched", cardId, previousCard.cardId);
    } else {
      this.setCardState("hidden", cardId, previousCard.cardId);
    }
  }

  setCardState(cardState: GameCard["state"], ...cardsToUpdate: number[]) {
    this.setState(state => ({
      cards: state.cards.map(c => {
        if (!cardsToUpdate.includes(c.cardId)) {
          return c;
        }
        return {
          ...c,
          state: cardState
        };
      })
    }));
  }

  render() {
    const { cards: results, loading } = this.state;

    return (
      <div>{loading ? this.renderLoading() : this.renderLoaded(results)}</div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderLoaded(results: GameCard[]): JSX.Element {
    return results.length === 0
      ? this.renderEmpty()
      : this.renderFilled(results);
  }

  renderFilled(results: GameCard[]): JSX.Element {
    return (
      <>
        <Panel>
          {results.map(card => (
            <Card
              key={card.cardId}
              gameCard={card}
              onClick={() => this.handleCardClicked(card.cardId)}
            />
          ))}
        </Panel>
      </>
    );
  }

  renderEmpty(): JSX.Element {
    return <div>No results</div>;
  }
}
