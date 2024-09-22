import * as React from 'react';
import { Typography } from "@mui/material";

import ComparisonDiagram from '../components/navigation/comparison';
import about_us_banner from '../images/home_page_banner.jpg';
import Person from '../components/about_me/about_me.js';

import { useEffect, useState } from "react";

const info_text = "On this page you can get to know us. Feel free to contact us!"

function About() {

  setTimeout(() => {
    document.getElementById('banner_image').src = about_us_banner;
    document.getElementById("banner-header").innerHTML = '';
  }, 60);

  const [us, setUs] = useState([]);
  useEffect(() => {
    let x = true;

    if (x) {

      fetch('https://software-secrets-blog.onrender.com/aboutus', {method: "GET"}).then(response => {
          response.json().then( persons => {
            //console.log(persons);
              setUs(persons);
          });
      });
    }
    return () => {setUs([])}

  }, []);

  console.log(us);

  return (
    <div>
      <div className='content'>
        <Typography className='header'>About Us</Typography> 
        <Typography>{info_text}</Typography>
      </div>
      <Person persons={us}></Person>
    </div>
  );
}
  
export default About;