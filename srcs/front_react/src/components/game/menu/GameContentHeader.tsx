import React from "react";

function GameContentHeader() {
  return (
    <div className="game__content__header">
      <div className="game__content__header__title">
        <h1>game</h1>
      </div>
      <div className="game__content__header__stat">
        <div className="stat__item">
          <h3>1</h3>
          <span>search</span>
        </div>
        <div className="stat__item">
          <h3>6</h3>
          <span>ingame</span>
        </div>
        <div className="stat__item">
          <h3>10</h3>
          <span>online</span>
        </div>
      </div>
    </div>
  );
}

export default GameContentHeader;
