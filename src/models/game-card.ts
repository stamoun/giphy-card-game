import { GiphyImage } from '../logic/giphy-api';

export type CardState = 'hidden' | 'revealed' | 'matched';

export interface GameCard {
  pairId: string;
  ezMode: boolean;
  cardId: number;
  state: CardState;
  image: GiphyImage;
}
