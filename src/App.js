import React from 'react';
import './App.css';
import Board from './Components/Board';
import { newBoard, getPieceMoves, replace } from './Components';
import Button from './Components/Button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      turn: '1',
      highlightMoves: [],
      currentlySelected: [],
      isAi: true
    };
    this.pieceChosen = this.pieceChosen.bind(this);
    this.pieceDropped = this.pieceDropped.bind(this);
    this.createBoard = this.createBoard.bind(this);
  }

  componentDidMount() {
    const lsGame = localStorage.getItem('react-checker');
    if (lsGame) {
      this.setState(JSON.parse(lsGame));
    } else {
      this.createBoard();
    }
  }

  static saveToStorage(state) {
    localStorage.setItem('react-checker', JSON.stringify(state));
  }

  createBoard() {
    this.setState({
      board: newBoard(),
      turn: '1',
      highlightMoves: [],
      currentlySelected: [],
    }, () => {
      localStorage.removeItem('react-checker');
    });
  }

  pieceChosen(coordinate) {
    const { board, turn } = this.state;
    const { x, y } = coordinate;
    this.setState({
      highlightMoves: getPieceMoves(board, x, y, turn),
      currentlySelected: [x, y],
    });
  }

  pieceDropped(to, from) {
    const { highlightMoves, board, turn, currentlySelected } = this.state;
    if (!from) {
      from = currentlySelected
    }
    const { x, y } = to;
    if (x === from[0] && y === from[1]) return;
    for (let i = 0; i < highlightMoves.length; i++) {
      let move = highlightMoves[i];
      if (move[0] === x && move[1] === y) {
        let newBoard = [...board];
        replace(newBoard, x, y, board[from[0]][from[1]]);
        replace(newBoard, from[0], from[1], '.');
        if (Math.abs(x - from[0]) > 1) {
          let xOffset = x - from[0] > 0 ? -1 : 1;
          let yOffset = y < from[1] ? 1 : -1;
          replace(newBoard, x + xOffset, y + yOffset, '.');
        }
        
        if (x === 0 && turn === '1') replace(newBoard, x, y, '3');
        if (x === 7 && turn === '2') replace(newBoard, x, y, '4');

        this.setState((prevState) => {
          const newState = {
            board: newBoard,
            turn: prevState.turn === '1' ? '2' : '1',
            highlightMoves: [],
            currentlySelected: []
          };
          App.saveToStorage(newState);
          return newState;
        }, () => {
          this.aiTurn();
        });
        break;
      }
    }
  }

  aiTurn() {
    const { board, isAi } = this.state;
    if (isAi && this.state.turn === '2') {
      const aiAction = this.aiMove(board);
      if (aiAction) {
        this.setState({
          highlightMoves: [aiAction.to],
          currentlySelected: aiAction.from
        }, () => {
          this.pieceDropped({ x: aiAction.to[0], y: aiAction.to[1] }, aiAction.from);
        });
      }
    }
  }

  aiMove(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        const move = getPieceMoves(board, i, j, '2');
        if (move.length) {
          return { from: [i, j], to: move[0] };
        }
      }
    }
  }

  render() {
    const { board, turn, highlightMoves, isAi } = this.state;

    return (
      <div className="game-container">
        <div className="game-header">
          <div>
          </div>
        </div>
        <Board
          board={board}
          turn={turn}
          onPieceSelected={this.pieceChosen}
          highlightMoves={highlightMoves}
          onPieceDrop={this.pieceDropped}
        />
        <div className="game-footer">
          <div>
          </div>
          <Button onClick={this.createBoard} text={`Restart`}/>
        </div>
      </div>
    );
  }
}

export default App;
