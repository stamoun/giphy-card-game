import { GiphyImage } from '../logic/giphy-api';

export type CardState = 'hidden' | 'revealed' | 'matched';

export interface GameCard {
  pairId: number;
  cardId: number;
  state: CardState;
  image: GiphyImage;
}
