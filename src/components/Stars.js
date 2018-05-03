import React from 'react';
import _ from "lodash";
import './Stars.css';

const Stars = (props) => {
    return (
        <div className="col-6">
            {_.range(props.numberOfStars).map(i =>
                <i key={i} className="fa fa-star"></i>
            )}
        </div>
    );
};

export default Stars;