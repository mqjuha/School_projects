import { Fragment } from "react";
import ReactLogo from './../../logo.svg';

import './end_bar.css'
import { Typography } from "@mui/material";


function Contact_info ({ className = '' })  {
    return (
        <div className={`contact-row ${className}`}>
            <Fragment>
                <div className="image">
                    <img src={ReactLogo}  />
                </div>
                <div className="contact-info">
                    <Typography className="abstract-text" variant="h6">Nimi Sukunimi</Typography>
                    <a className="abstract-text">LinkedIn profile</a>
                </div>

            </Fragment>
        </div>
    );
}

export default function Endbar () {
    return (
        <Fragment>
            <div className="end-section">
                <Contact_info/>
                <Contact_info/>
            </div>
        </Fragment>


    );
}
