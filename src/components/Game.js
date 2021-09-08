import React from 'react';
import Board from './Board';

const Game = () => {
  const height = 8;
  const width = 8;
  const numberOfMines = 10;

  return (
    <div className='container'>
        <h2>Minesweeper</h2>
      <Board height={height} width={width} numberOfMines={numberOfMines} />
    </div>
  );
};

export default Game;
