import * as React from 'react';
import { Fragment } from "react";

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

import './about_me.css'

import { Typography } from "@mui/material";

import { Link } from 'react-router-dom';

/*const persons = [
    { 
        name: 'First Last',
        job: 'Student',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nibh purus, porta sit amet ultrices in, aliquet sed libero. Nulla a accumsan turpis. Cras aliquet, nunc sollicitudin bibendum iaculis, arcu ante pellentesque nisl, nec tristique nibh quam eu lorem. Vivamus vel quam a neque molestie pulvinar. Sed nec euismod est. Vestibulum at luctus tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ullamcorper lacus a tortor iaculis fringilla.',
        img: "https://cdn.pixabay.com/photo/2015/04/17/03/01/the-locale-726512_1280.jpg",
        linkedin: '',
        email: 'first.last@gmail.com',
    },
    { 
        name: 'First Last',
        job: 'Student',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nibh purus, porta sit amet ultrices in, aliquet sed libero. Nulla a accumsan turpis. Cras aliquet, nunc sollicitudin bibendum iaculis, arcu ante pellentesque nisl, nec tristique nibh quam eu lorem. Vivamus vel quam a neque molestie pulvinar. Sed nec euismod est. Vestibulum at luctus tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ullamcorper lacus a tortor iaculis fringilla.',
        img: "https://cdn.pixabay.com/photo/2019/02/08/15/34/girl-3983410_1280.jpg",
        linkedin: '',
        email: 'first.last@gmail.com',
    },
]*/

export default function PersonalInfo( {persons} ) {

    //console.log(persons);
    
    return (
        <Fragment>
            <div className='persons'>
                {persons.map( person => (
                    <div className='person-section'>
                        <div className='side person-img'>
                            <img src={person.img} />
                        </div>
                        <div className='side'>
                            <div className='person-content'>
                                <Typography className='person_header'>{person.name}</Typography>
                                <Typography className='person_header'>{person.job}</Typography>

                                <Typography>{person.desc}</Typography>

                                <div className='contact-info'>
                                    <div className="contact-info-container">
                                        <LinkedInIcon></LinkedInIcon>
                                        <Link className='link' to={person.linkedin}
                                            >LinkedIn
                                        </Link>
                                    </div>

                                    <div className="contact-info-container">
                                        <EmailIcon></EmailIcon>
                                        <Typography
                                            >{person.email}
                                        </Typography>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Fragment>
    );
}