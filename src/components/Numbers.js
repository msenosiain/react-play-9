import React from 'react';
import _ from 'lodash';
import './Numbers.css';

const Numbers = (props) => {
    const numberClassName = (number) => {
        if (props.usedNumbers.indexOf(number) >= 0) {
            return 'used';
        }
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return 'selected';
        }
    };
    return (
        <div className="card text-center">
            <div>
                {Numbers.list.map((number, i) =>
                        <span key={i} className={numberClassName(number)}
                              onClick={() => props.selectNumber(number)}>
          	{number}
          </span>
                )}
            </div>
        </div>
    );
};

Numbers.list = _.range(1, 10);

export default Numbers;