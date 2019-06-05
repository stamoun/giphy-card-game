import { GiphyImage } from "../logic/giphy-api";

export interface GameCard {
  pairId: string;
  cardId: number;
  state: "hidden" | "revealed" | "matched";
  image: GiphyImage;
}
