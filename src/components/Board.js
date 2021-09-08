import React, { useState } from 'react';
import Cell from './Cell';
import { getMines, getFlags, getHidden } from '../helper';

const Board = (props) => {
  const [mineCount, setMineCount] = useState(props.numberOfMines);
  const [win, setWin] = useState(false);
  const [playGame, setPlayGame] = useState(true);
  const [gameMessage, setGameMessage] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [gameIsPlaying, setGameIsPlaying] = useState(false);

  const createEmptyArray = (height, width) => {
    let data = [];
    for (let x = 0; x < height; x++) {
      data.push([]);
      for (let y = 0; y < width; y++) {
        data[x][y] = {
          x: x,
          y: y,
          isMine: false,
          neighbour: 0,
          revealed: false,
          flagged: false,
          empty: false
        };
      }
    }

    return data;
  };

  const plantMines = (data, mines) => {
    let randomX = 0;
    let randomY = 0;
    let minesPlanted = 0;
    while (minesPlanted < mines) {
      randomX = Math.floor(Math.random() * data.length);
      randomY = Math.floor(Math.random() * data.length);
      if (!data[randomX][randomY].isMine) {
        data[randomX][randomY].isMine = true;
        minesPlanted++;
      }
    }
    return data;
  };

  const traverseBoard = (data, x, y) => {
    const neighbour = [];
    //up
    if (x > 0) {
      neighbour.push(data[x - 1][y]);
    }
    //down
    if (x < props.height - 1) {
      neighbour.push(data[x + 1][y]);
    }
    //left
    if (y > 0) {
      neighbour.push(data[x][y - 1]);
    }
    //right
    if (y < props.width - 1) {
      neighbour.push(data[x][y + 1]);
    }
    // top left
    if (x > 0 && y > 0) {
      neighbour.push(data[x - 1][y - 1]);
    }
    // top right
    if (x > 0 && y < props.width - 1) {
      neighbour.push(data[x - 1][y + 1]);
    }
    // bottom right
    if (x < props.height - 1 && y < props.width - 1) {
      neighbour.push(data[x + 1][y + 1]);
    }
    // bottom left
    if (x < props.height - 1 && y > 0) {
      neighbour.push(data[x + 1][y - 1]);
    }
    return neighbour;
  };

  const getNeighbours = (data, height, width) => {
    let updatedData = data;
    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        if (data[x][y].isMine !== true) {
          let mine = 0;
          const neighboursArea = traverseBoard(
            data,
            data[x][y].x,
            data[x][y].y
          );
          neighboursArea.forEach((value) => {
            if (value.isMine) {
              mine++;
            }
          });
          if (mine === 0) {
            updatedData[x][y].empty = true;
          }
          updatedData[x][y].neighbour = mine;
        }
      }
    }
    return updatedData;
  };

  const initBoard = (height, width, mines) => {
    let data = createEmptyArray(height, width);
    data = plantMines(data, mines);
    data = getNeighbours(data, height, width);
    return data;
  };

  const [boardData, setBoardData] = useState(
    initBoard(props.width, props.height, props.numberOfMines)
  );

  const revealBoard = () => {
    let updatedData = boardData;
    updatedData.forEach((datarow) => {
      datarow.forEach((dataitem) => {
        if (
          (!dataitem.isMine && dataitem.flagged) ||
          (dataitem.isMine && !dataitem.flagged) ||
          (!dataitem.isMine && !dataitem.flagged)
        ) {
          dataitem.revealed = true;
        }
      });
    });
    setBoardData(updatedData);
  };

  const revealEmptyCells = (data, x, y) => {
    let area = traverseBoard(data, x, y);
    area.forEach((value) => {
      if (!value.revealed && (value.empty || !value.isMine)) {
        data[value.x][value.y].revealed = true;
        if (value.empty) {
          revealEmptyCells(data, value.x, value.y);
        }
      }
    });
    return data;
  };
  const handleRightClick = (e, x, y) => {
    e.preventDefault();
    let updatedData = boardData;
    let mines = mineCount;
    if (updatedData[x][y].revealed) return;
    if (updatedData[x][y].flagged && mines <= 10) {
      updatedData[x][y].flagged = false;
      mines++;
    } else if (!updatedData[x][y].flagged && mines >= 1) {
      updatedData[x][y].flagged = true;
      mines--;
    }
    if (mines === 0) {
      const mineArray = getMines(updatedData);
      const flagArray = getFlags(updatedData);
      if (JSON.stringify(mineArray) === JSON.stringify(flagArray)) {
        revealBoard();
        setWin(true);
        setGameIsPlaying(false);
        setGameMessage(true);
      }
    }
    setBoardData(updatedData);
    setMineCount(mines);
  };

  const handleLeftClick = (x, y) => {
    if (boardData[x][y].revealed) {
      return null;
    }
    if (boardData[x][y].isMine) {
      setWin(false);
      revealBoard();
      setGameMessage(true);
    }
    let updatedData = boardData;
    updatedData[x][y].flagged = false;
    updatedData[x][y].revealed = true;

    if (updatedData[x][y].empty) {
      updatedData = revealEmptyCells(updatedData, x, y);
    }
    if (getHidden(updatedData).length === props.numberOfMines) {
      revealBoard();
      setWin(true);
      setGameIsPlaying(false);
      setGameMessage(true);
    }
    setBoardData(updatedData);
    setMineCount(props.numberOfMines - getFlags(updatedData).length);
    setTrigger(trigger + 1);
  };

  const startGame = () => {
    setBoardData(initBoard(props.width, props.height, props.numberOfMines));
    setGameMessage(false);
    setPlayGame(false);
    setMineCount(props.numberOfMines);
    setGameIsPlaying(true);
  };

  const renderBoard = (data) => {
    let board = [];
    for (let x = 0; x < data.length; x++) {
      for (let y = 0; y < data[x].length; y++) {
        board.push(
          <Cell
            key={x + '-' + y}
            value={data[x][y]}
            onLeftClick={() => handleLeftClick(x, y)}
            onRightClick={(e) => handleRightClick(e, x, y)}
          />
        );
      }
    }
    return board;
  };

  return (
    <div>
      {gameMessage && (
        <div className='status'>{win ? 'You Win!' : 'Game Over!'}</div>
      )}
      {!gameMessage && (
        <div className='status'>Mines remaining: {mineCount}</div>
      )}

      {gameMessage && (
        <button className='play' onClick={startGame}>
          Play Again!
        </button>
      )}
      {playGame && (
        <button className='play' onClick={startGame}>
          Play!
        </button>
      )}
      <div className='board'>{renderBoard(boardData)}</div>
    </div>
  );
};

export default Board;
