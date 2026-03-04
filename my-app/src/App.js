import {useState} from 'react';
import './App.css';

function Board({value, handleBoard}) {
  return <button className="myBoard" onClick ={handleBoard}>{value}</button>
}

export default function BuildBoard() {
  const [squares, setSquares] = useState(Array(10).fill(null))
  const [oxTurn, setOxTurn] = useState(true)

  function clickBoard(i) {
    const newSquares = squares.slice();
    if(newSquares[i])
    {
      return;
    }
    if(oxTurn)
    {
      newSquares[i] = "X";
    }
    else{
      newSquares[i] = "O";
    }
    setOxTurn(!oxTurn);
    setSquares(newSquares);
  }

  return (
    <>
      <div>
        <Board value={squares[0]} handleBoard={() => clickBoard(0)} />
        <Board value={squares[1]} handleBoard={() => clickBoard(1)} />
        <Board value={squares[2]} handleBoard={() => clickBoard(2)} />
      </div>
      <div>
        <Board value={squares[3]} handleBoard={() => clickBoard(3)} />
        <Board value={squares[4]} handleBoard={() => clickBoard(4)} />
        <Board value={squares[5]} handleBoard={() => clickBoard(5)} />
      </div>
      <div>
        <Board value={squares[6]} handleBoard={() => clickBoard(6)} />
        <Board value={squares[7]} handleBoard={() => clickBoard(7)} />
        <Board value={squares[8]} handleBoard={() => clickBoard(8)}/>
      </div>
    </>
  );
}

function WhoWins({squares}) {
  const endGame = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]

  for(let ax=0; ax<endGame.length(); ax++)
  {
    
  }
}