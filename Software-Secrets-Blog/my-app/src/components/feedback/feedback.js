//import * as React from 'react';
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';


import './feedback.css'

import { TextField, Button, Typography } from '@mui/material';

import { useRef } from 'react';
import emailjs from '@emailjs/browser';

//import Pagination from '@mui/material/Pagination';
//import Stack from '@mui/material/Stack';

const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color="error" />,
      label: 'Very Dissatisfied',
      color: 'error',
    },
    2: {
      icon: <SentimentDissatisfiedIcon color="error" />,
      label: 'Dissatisfied',
      color: 'error',
    },
    3: {
      icon: <SentimentSatisfiedIcon color="warning" />,
      label: 'Neutral',
      color: 'warning.main',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color="success" />,
      label: 'Satisfied',
      color: 'success.main',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color="success" />,
      label: 'Very Satisfied',
      color: 'success.main',
    },
  };

  const ratings = [ ];

  export default function Feedbacks () {

    const form = useRef();

    // Sends feedback to Julia's email
    const sendEmail = (e) => {
      e.preventDefault();

      var message = document.getElementById('free_feedback').value;

      var templateParams = {
        question0: ratings[0],
        question1: ratings[1],
        question2: ratings[2],
        question3: ratings[3],
        textFeedback: message
      };

      emailjs.send(
        'service_3u94pwf',
        'template_86p0tkk',
        templateParams,
        '2Nxivev2iyC5CDLQB'
        )
        .then( function (result) {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        
    };

    const [showForm, setShowForm] = useState(true);
    const [showButton, setShowButton] = useState(false);

    const toggleButton = () => {
      setShowForm(!showForm);
      setShowButton(!showButton);
    };

    const formReady = (event) => {
      toggleButton();
      sendEmail(event);
    }

    return (
      <div className="section">
        {
          showForm?<form className="question-column" ref={form}>
              <h2 className='main-header'>Give us useful feedback to improve the website! :)</h2>
              <div className='question-column'>
                <RadioGroupRating id='question1' question='What do you think about the blog?' number={0}></RadioGroupRating>         
                <RadioGroupRating id='question2' question='How easy it was to find what you were looking for?' number={1}></RadioGroupRating>               
                <RadioGroupRating id='question3' question='Did the website meet your expectations?' number={2}></RadioGroupRating>                
                <RadioGroupRating id='question4' question='How likely you will recommend the website?' number={3}></RadioGroupRating>

                <div className='question'>
                    <h6 className='question-text'>Please give feedback !</h6>

                     
                    <TextField
                      multiline
                      rows={5}
                      variant="outlined"
                      fullWidth 
                      sx={{
                        background: "white",
                      }}
                      defaultValue="Thank you for the feedback!"
                      id='free_feedback'
                    />
                    
                </div>

              </div>
              
              <Button
                className='send-button'
                type='submit'
                onClick={formReady}
                >
                Send Feedback
              </Button>
              
          </form>: null
        }
        {
          showButton?<div className="question-column">
            <h2>We appreciate your feedback! :)</h2>
            <Button 
              className='send-button'
              onClick={toggleButton}
              >
                Send more feedback
            </Button>
          </div>: null
        }
    </div>      
  );
}

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

function RadioGroupRating(props) {

    const [value, setValue] = React.useState(2);

    ratings[props.number] = customIcons[value].label;

    return (
        <div className='question'>
          <h6 className='question-text'>{props.question}</h6>
           
          <StyledRating
              name="highlight-selected-only"
              IconContainerComponent={IconContainer}
              getLabelText={(value) => customIcons[value].label}
              value={value}
              onChange={(event, newValue) => {
                if ( newValue !== null ) {
                    setValue(newValue);
                }   
              }}
              highlightSelectedOnly
          />

          <Typography color={customIcons[value].color}>{customIcons[value].label}</Typography>
        </div>
    );
}