/* source : https://codepen.io/gaearon/pen/oWWQNa?editors=0010 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
        <button className={"square" + (props.hilite ? " hilite" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return ( 
            <Square 
                value = {this.props.squares[i]} 
                onClick = {() => this.props.onClick(i)} 
                hilite = {this.props.winner && this.props.winner.squares.includes(i)} 
            />
        );
    }

    render() {
        let rows = [];

        for (let i = 0; i < 3; i++){
            let squares = [];
            for (let j = 0; j < 3; j++){
                squares.push(this.renderSquare((3 * i) + j));
            }
            rows.push(
                <div className="board-row">
                    {squares}
                </div> 
            );
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                xIsNext: true,
                moveDescription: "Empty board",
                winner: null,
            }],   
            stepNumber: 0,
            isReverse: false,
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (current.winner || squares[i]){
            return;
        }

        squares[i] = current.xIsNext ? "X" : "O";
        let moveDescription = squares[i] + " marked box [" + (i % 3) + ", " + ((i - (i % 3)) / 3) + "]";
        let winner = calculateWinner(squares);
        if (winner){
            moveDescription += ", " + winner.name + " wins!";
        }else{
            let emptySquares = squares.filter(x => x == null);
            if (emptySquares.length == 0){
                moveDescription += ", Game over!";
            }
        }
        this.setState({
            history: history.concat([{
                squares: squares,
                xIsNext: !current.xIsNext,
                moveDescription: moveDescription,
                winner: winner,
            }]),
            stepNumber: history.length,
        });
    }
    
    jumpTo(index){
        this.setState({
            stepNumber: index            
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const winner = current.winner;
        let status;

        if (winner){
            status = "Winner: " + winner.name;
        }else{
            if (current.squares.filter(x => x == null).length == 0){
                status = "Game over, it's a draw";
            }else{
                status = "Next player: " + (current.xIsNext ? "X" : "O");
            }
        }       
        
        let historyButtons = history.map((value, index) => {
            const description = value.moveDescription;
            return (
                <li key={index}>
                    <button 
                        className={this.state.stepNumber == index ? "selected" : ""} 
                        onClick={() => this.jumpTo(index)}>{description}
                    </button>
                </li>
            );
        }, this);

        if (this.state.isReverse){
            historyButtons = historyButtons.slice().reverse();
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winner={current.winner}
                        onClick={(i) => this.handleClick(i)}                        
                    />
                </div>
                <div className="game-info">                    
                    <div>{status}</div>
                    <button onClick={() => this.setState({ isReverse: !this.state.isReverse})}>
                        {this.state.isReverse ? "newest first" : "oldest first"}
                    </button>
                    <ol>{historyButtons}</ol>
                </div>
            </div>
        );
    }
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
        return { 
            name: squares[a],
            squares: [a, b, c],
        };
      }
    }

    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
