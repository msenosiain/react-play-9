import React, { Component } from 'react';
import _ from 'lodash';
import 'containers/Game.css';
import Stars from 'components/Stars';
import Button from 'components/Button';
import Numbers from 'components/Numbers';

var possibleCombinationSum = function (arr, n) {
    if (arr.indexOf(n) >= 0) {
        return true;
    }
    if (arr[0] > n) {
        return false;
    }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount; i++) {
        var combinationSum = 0;
        for (var j = 0; j < listSize; j++) {
            if (i & (1 << j)) {
                combinationSum += arr[j];
            }
        }
        if (n === combinationSum) {
            return true;
        }
    }
    return false;
};

const Answer = (props) => {
    return (
        <div className="col-5">
            {props.selectedNumbers.map((number, i) =>
                    <span key={i} onClick={() => props.unselectNumber(number)}>
        	{number}
        </span>
            )}
        </div>
    );
};

const DoneFrame = (props) => {
    return (
        <div className="text-center">
            <h2>{props.doneStatus}</h2>
            <button className="btn btn-secondary" onClick={props.resetGame}>
                Play Again
            </button>
        </div>
    )
};

class Game extends Component {
    static randomNumber = () => 1 + Math.floor(Math.random() * 9);
    static initialState = () => ({
        selectedNumbers: [],
        randomNumberOfStars: Game.randomNumber(),
        usedNumbers: [],
        answerIsCorrect: null,
        redraws: 5,
        doneStatus: null
    });
    state = Game.initialState();
    resetGame = () => this.setState(Game.initialState());
    selectNumber = (clickedNumber) => {
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0 || this.state.usedNumbers.indexOf(clickedNumber) >= 0) {
            return;
        }
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    };
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers
                .filter(number => number !== clickedNumber)
        }));
    };
    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.randomNumberOfStars ===
            prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
        }));
    };
    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            answerIsCorrect: null,
            randomNumberOfStars: Game.randomNumber(),
        }), this.updateDoneStatus);
    };
    redraw = () => {
        if (this.state.redraws === 0) {
            return;
        }
        this.setState(prevState => ({
            randomNumberOfStars: Game.randomNumber(),
            answerIsCorrect: null,
            selectedNumbers: [],
            redraws: prevState.redraws - 1,
        }), this.updateDoneStatus);
    };
    possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
        const possibleNumbers = _.range(1, 10).filter(number =>
            usedNumbers.indexOf(number) === -1
        );

        return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
    };
    updateDoneStatus = () => {
        this.setState(prevState => {
            if (prevState.usedNumbers.length === 9) {
                return {doneStatus: 'Done. Nice!'};
            }
            if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
                return {doneStatus: 'Game Over!'};
            }
        });
    };

    render() {
        const {
            selectedNumbers,
            randomNumberOfStars,
            answerIsCorrect,
            usedNumbers,
            redraws,
            doneStatus
        } = this.state;

        return (
            <div className="container">
                <h3 className="text-center">Play Nine</h3>
                <hr/>
                <div className="row">
                    <Stars numberOfStars={randomNumberOfStars}/>
                    <Button selectedNumbers={selectedNumbers}
                            redraws={redraws}
                            checkAnswer={this.checkAnswer}
                            acceptAnswer={this.acceptAnswer}
                            redraw={this.redraw}
                            answerIsCorrect={answerIsCorrect}/>
                    <Answer selectedNumbers={selectedNumbers}
                            unselectNumber={this.unselectNumber}/>
                </div>
                <br/>
                {doneStatus ?
                    <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/> :
                    <Numbers selectedNumbers={selectedNumbers}
                             selectNumber={this.selectNumber}
                             usedNumbers={usedNumbers}/>
                }
            </div>
        );
    }
}

export default Game;