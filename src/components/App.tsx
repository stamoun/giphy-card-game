import React from "react";
import { Game } from "./Game";

interface AppState {
  draftCardCount: number;
  cardCount: number;
  draftSearch: string;
  search: string;
}

const GAME_SIZES = [12, 16, 20, 30, 36, 42, 56, 64];

export class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      draftCardCount: 16,
      cardCount: 16,
      draftSearch: "Nicolas Cage",
      search: "Nicolas Cage"
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCardCountChange = this.handleCardCountChange.bind(this);
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleFormSubmit}>
          <label>
            Search:
            <input
              type="text"
              value={this.state.draftSearch}
              onChange={this.handleSearchChange}
            />
          </label>
          <label>
            Card count:
            <select
              value={this.state.draftCardCount}
              onChange={this.handleCardCountChange}
            >
              {GAME_SIZES.map(s => (
                <option value={s} key={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Start</button>
        </form>
        <Game search={this.state.search} cardCount={this.state.cardCount} />
      </div>
    );
  }

  handleCardCountChange(e: any) {
    const next = parseInt(e.target.value, 10);
    this.setState({ draftCardCount: next });
  }

  handleSearchChange(e: any) {
    this.setState({ draftSearch: e.target.value });
  }

  handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    this.setState(state => ({
      cardCount: state.draftCardCount,
      search: state.draftSearch
    }));
  }
}

export default App;
