import { Button } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

interface SquarePropsType{
    value:string,

    onClick: any
}

interface StateType{
    value:string

    num:number
}
class Square extends React.Component<SquarePropsType,StateType> {
  
    render() {
      return (
        <button className="square" onClick={()=>
            this.props.onClick()
        }>
          {this.props.value}
        </button>
      );
    }
  }
  
  interface BoardStateType{
    
    XIsNext: boolean
    squares:string[]
  }

  interface BoardPropsType{
    squares:string[];

    OnClick:any;
  }
  class Board extends React.Component<BoardPropsType,BoardStateType> {


    renderSquare(i:number) {
      return <Square value={this.props.squares[i]}
              onClick={()=>{
                this.props.OnClick(i);
            }}
      />;
    }
    
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  

  interface GameProps{

  }

  interface History{
      squares:string[]
  }
  interface GameState{
    
    history:History[]
    XIsNext:boolean;
    stepNumber: number
  }
  class Game extends React.Component<GameProps,GameState> {
    handleClick(i:number){
        const history = this.state.history.slice(0,this.state.stepNumber +1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.XIsNext ? 'X':'O'
        this.setState({history:history.concat([
            {
                squares:squares
            },
            
        ]),
        stepNumber:history.length,
        XIsNext:!this.state.XIsNext})
        
    }
    jumpTo(step:number) {
        this.setState({
          stepNumber: step,
          XIsNext: (step % 2) === 0,
        });
      }
    constructor(props:GameProps){
        super(props)
        this.state = {
            history: [{squares:[]}],
            XIsNext:true,
            stepNumber:0,
        }
    }

    render() { 
    const history = this.state.history; 
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move)=>{
        const desc = move ? 'Go to move #' + move : 'Go to game start';
        return (
            <li key={move} >
              <Button type='default' onClick={()=>this.jumpTo(move)}>{desc}</Button>
            </li>
        )
    })
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.XIsNext ? 'X' : 'O');
    }
      return (
        <div className="game">
          <div className="game-board">
            <Board  squares={current.squares} OnClick={(i:number)=>this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ul>{moves}</ul>
          </div>
        </div>
      );
    }
  }
  
  function calculateWinner(squares:string[]) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]

    for (const line of lines) {
        const [a,b,c] = line;
        if(squares[a] && squares[a]===squares[b]&& squares[a]===squares[c]){
                return squares[a];
        }
        
    }
    return null;
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  