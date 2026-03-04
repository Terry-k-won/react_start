import {useState} from 'react';
import './App.css';

function Board({value}) {
  return <button className="myBoard">{value}</button>
}

export default function buildBoard() {
  return (
    <>
      <div>
        <Board value='1' />
        <Board value='2' />
        <Board value='3' />
      </div>
      <div>
        <Board value='4' />
        <Board value='5' />
        <Board value='6' />
      </div>
      <div>
        <Board value='7' />
        <Board value='8' />
        <Board value='9' />
      </div>
    </>
  );
}