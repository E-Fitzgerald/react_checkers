import React from 'react';
import './Board.css';
import { names, getColor, getHighlightRows } from '../Components';


const Board = ({ board, highlightMoves, ...otherProps }) => {
  const rowsWithHighlights = getHighlightRows(highlightMoves);
  return (
    <div className="board-container">
      {board.map((row, i) => (
        <Row
          key={i}
          xCoord={i}
          row={row}
          hasHighlightedSquares={rowsWithHighlights[i]}
          {...otherProps}
        />
      ))}
    </div>
  );
};

const Row = ({ xCoord, row, hasHighlightedSquares, ...otherProps }) => {
  const squares = [];
  function checkHighlight(index) {
    return !!(
      Array.isArray(hasHighlightedSquares) &&
      hasHighlightedSquares.indexOf(index) !== -1
    );
  }
  for (let i = 0; i < row.length; i++) {
    squares.push(
      <Square
        key={`${xCoord}-${i}`}
        xCoord={xCoord}
        yCoord={i}
        playerPiece={row[i]}
        isHighlighted={checkHighlight(i)}
        {...otherProps}
      />
    );
  }
  return <div className={`board-row board-row-${xCoord}`}>{squares}</div>;
};

const Square = ({
  xCoord,
  yCoord,
  playerPiece,
  onPieceSelected,
  isHighlighted,
  turn,
  onPieceDrop,
}) => {
  const isDraggable = playerPiece !== '.';
  function onDragStart() {
    onPieceSelected({ x: xCoord, y: yCoord });
  }

  function onDrop(ev) {
    ev.preventDefault();
    onPieceDrop({ x: xCoord, y: yCoord });
  }

  function onDragOver(ev) {
    ev.preventDefault();
  }

  return (
    <div
      className={names(
        'board-square',
        `board-square-${getColor(xCoord, yCoord)}`
      )}
    >
      <div
        className={names('board-square-player-piece', 'board-square-K1', {
          'board-square-highlight-1': isHighlighted && turn === '1',
          'board-square-highlight-2': isHighlighted && turn === '2',
          'board-square-1':
            playerPiece === '1' || playerPiece === '3',
          'board-square-2':
            playerPiece === '2' || playerPiece === '4',
        })}
        draggable={isDraggable}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMouseOver={onDragStart}
      >
        {(playerPiece === '3' || playerPiece === '4') && (
          <span>King</span>
        )}
      </div>
    </div>
  );
};

export default Board;