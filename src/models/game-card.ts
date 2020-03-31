import { GiphyImage } from '../logic/giphy-api';

export type CardState = 'hidden' | 'revealed' | 'matched';

export interface GameCard {
  pairId: string;
  cardId: number;
  state: CardState;
  image: GiphyImage;
}
