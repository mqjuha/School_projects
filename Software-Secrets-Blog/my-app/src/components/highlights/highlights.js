import { Fragment } from "react";
import ReactLogo from './../../logo.svg';

import './highlights.css'
import { Typography } from "@mui/material";


function Abstract ({ className = '' })  {
    return (
        <div className={`highlight-abstract ${className}`}>
            <Fragment>
            <img src={ReactLogo} className="highlight-image" />
                <Typography className="highlight-abstract-header" variant="h6">Otsikko</Typography>
                <Typography className="highlight-font">
                    Lorem ipsum dolor sit amet, blandit ante, 
                    amet ac lectus pulvinar integer sit, et feugiat, 
                    eleifend ut ligula libero leo quam, nunc litora nunc. 
                    Fusce egestas justo mauris velit. 
                </Typography>
            </Fragment>
        </div>
    );
}

export default function Highlights () {
    return (
        <div className="highlight-section">
            <h2 className="highlight-light-header">Highlights</h2>
            <div className="highlight-abstract-row">                   
                <Abstract className="red-theme"/>
                <Abstract className="blue-theme"/>
                <Abstract className="yellow-theme"/>
            </div>
        </div>

    );
}
