import React, { useState } from 'react';
import { Game } from './Game';

const GAME_SIZES = [12, 16, 20, 30, 36, 42, 56, 64];

export const App = () => {
  const [draftCardCount, setDraftCardCount] = useState(16);
  const [cardCount, setCardCount] = useState(16);
  const [draftSearch, setDraftSearch] = useState('Nicolas Cage');
  const [search, setSearch] = useState('Nicolas Cage');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardCount(draftCardCount);
    setSearch(draftSearch);
  };

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDraftSearch(e.currentTarget.value);
  };

  const handleCardCountChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const next = parseInt(e.currentTarget.value, 10);
    setDraftCardCount(next);
  };

  return (
    <div className="App">
      <form onSubmit={handleFormSubmit}>
        <label>
          Search:
          <input
            type="text"
            value={draftSearch}
            onChange={handleSearchChange}
          />
        </label>
        <label>
          Card count:
          <select value={draftCardCount} onChange={handleCardCountChange}>
            {GAME_SIZES.map(s => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={!draftSearch}>
          Start
        </button>
      </form>

      <Game search={search} cardCount={cardCount} />
    </div>
  );
};

export default App;
