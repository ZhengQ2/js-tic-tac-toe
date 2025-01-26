import { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const full = calculateFull(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (full){
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }


  return (
    <>
      <div className="status">{status}</div>
      {Array(3).fill(null).map((_, row) => (
        <div key={row} className="board-row">
          {Array(3).fill(null).map((_, col) => {
            const index = row * 3 + col; // Calculate index for squares array
            return (
              <Square 
                key={index} 
                value={squares[index]} 
                onSquareClick={() => handleClick(index)} 
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ai, setAi] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  useEffect(() => {
    if (ai && !xIsNext) { // AI plays only when it's its turn
      const nextMove = runAI(currentSquares);
      if (nextMove !== null) {
        const aiSquares = currentSquares.slice();
        aiSquares[nextMove] = 'O';
        setTimeout(() => handlePlay(aiSquares), 500); // Delay AI move for better UX
      }
    }
  }, [xIsNext, ai, currentSquares]);

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function activateAI(ai) {
    setAi(!ai);
  }

  function runAI(squares) {
    // Get available moves
    const availableMoves = squares
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);

    if (availableMoves.length === 0) return null;

    // Check for a winning move
    for (let move of availableMoves) {
      const testSquares = squares.slice();
      testSquares[move] = "O"; // Simulate AI move
      if (calculateWinner(testSquares) === "O") {
        return move;
      }
    }

    // Check if the opponent (X) is about to win and block
    for (let move of availableMoves) {
      const testSquares = squares.slice();
      testSquares[move] = "X"; // Simulate opponent move
      if (calculateWinner(testSquares) === "X") {
        return move; // Block the win
      }
    }

    // Otherwise, pick a random available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    if (move === currentMove) {
      return (
        <li key={move}>
          <text>{description}</text>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  let ai_des;

  if (ai) {
    ai_des = 'deactivate AI';
  } else {
    ai_des = 'activate AI';
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={() => activateAI(ai)}>{ai_des}</button>
        <button onClick={() => jumpTo(0)}>Reset</button>
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

function calculateFull(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}
