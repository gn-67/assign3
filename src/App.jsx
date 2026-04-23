import { useState } from 'react';

function Square({ value, onSquareClick, isSelected }) {
  return (
    <button
      className={'square' + (isSelected ? ' selected' : '')}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const currentPlayer = xIsNext ? 'X' : 'O';
  const pieceCount = squares.filter(s => s === currentPlayer).length;
  const isMovementPhase = pieceCount >= 3;

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }

    if (!isMovementPhase) {
      // placement phase: same as tic-tac-toe
      if (squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      nextSquares[i] = currentPlayer;
      onPlay(nextSquares);
    } else {
      // movement phase: first click selects, second click moves
      if (selectedSquare === null) {
        // select one of your own pieces
        if (squares[i] !== currentPlayer) {
          return;
        }
        setSelectedSquare(i);
      } else {
        // clicking the same square deselects
        if (i === selectedSquare) {
          setSelectedSquare(null);
          return;
        }
        // clicking another own piece switches selection
        if (squares[i] === currentPlayer) {
          setSelectedSquare(i);
          return;
        }
        // destination must be empty
        if (squares[i]) {
          return;
        }
        // TODO: adjacency check (stage 2)
        // TODO: center square rule (stage 3)
        const nextSquares = squares.slice();
        nextSquares[selectedSquare] = null;
        nextSquares[i] = currentPlayer;
        setSelectedSquare(null);
        onPlay(nextSquares);
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isSelected={selectedSquare === 0} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isSelected={selectedSquare === 1} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isSelected={selectedSquare === 2} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isSelected={selectedSquare === 3} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isSelected={selectedSquare === 4} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isSelected={selectedSquare === 5} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isSelected={selectedSquare === 6} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isSelected={selectedSquare === 7} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isSelected={selectedSquare === 8} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
