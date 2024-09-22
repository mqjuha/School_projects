import * as React from 'react';
import { Fragment } from "react";

import './feedback_announcement.css'

import { Typography } from "@mui/material";

import { Link } from 'react-router-dom';


export default function FeedbackAnnouncement() {
    
    return (
        <Fragment>
            <div className="info-section">
                <div className='feedback-info-content'>
                    <h2 className='feedback-header'>Send Feedback</h2>

                    <Typography>
                        Would you like to give feedback about the website?<br/> 
                        Do you have a good idea about what we should covered on the blog?
                    </Typography>
                    
                    <div justify="space-between">
                        <Typography className='left-text'
                            >Give feedback on 
                        </Typography>
                        
                        <Link className='right-text' to='/feedback'
                            >Feedback page
                        </Link>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}