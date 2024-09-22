import * as React from 'react';

import './home_page.css'

import ReactLogo from './../logo.svg';

import Highlights from '../components/highlights/highlights';
import FeedbackAnnouncement from '../components/feedback/feedback_announcement';
import { Typography } from '@mui/material';


import home_banner from '../images/home_page_banner.jpg'


function Home() {

  // make sure that the img element exists and that it has been rendered to the DOM before you try to set its src property. 
  setTimeout(() => {
    document.getElementById('banner_image').src = home_banner;
    document.getElementById("banner-header").innerHTML = "Software Secrets";
  }, 60);


  const textPlaseHolder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nibh purus, porta sit amet ultrices in, aliquet sed libero. Nulla a accumsan turpis. Cras aliquet, nunc sollicitudin bibendum iaculis, arcu ante pellentesque nisl, nec tristique nibh quam eu lorem. Vivamus vel quam a neque molestie pulvinar. Sed nec euismod est. Vestibulum at luctus tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ullamcorper lacus a tortor iaculis fringilla.";

  // Get from database
  const topics = [
    {
      id: 1,
      title: "Title 1",
      desc: textPlaseHolder,
      img: "https://cdn.pixabay.com/photo/2020/07/08/04/12/work-5382501_1280.jpg",
      theme: "red-theme"
    },
    {
      id: 2,
      title: "Title 2",
      desc: textPlaseHolder,
      img: "https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_640.jpg",
      theme: "blue-theme"
    },
    {
      id: 3,
      title: "Title 3",
      desc: textPlaseHolder,
      img: "https://cdn.pixabay.com/photo/2015/05/28/14/36/ux-787968_1280.jpg",
      theme: "yellow-theme"
    }
  ]
  
  return (

    <div className='wrapper'>
      <div className='content'>
        <Typography className='header'>Title</Typography> 
        <Typography>{textPlaseHolder}</Typography>
      </div>
      <Highlights></Highlights>
      <div className='topics'>
        {topics.map(topic=>(
          <div className={`topic ${topic.theme}`} key={topic.id}>
            <div className='img'>
              <img  src={topic.img} />
            </div>
            <div className='content'>
              <Typography className='header'>{topic.title}</Typography>
              <Typography>{topic.desc}</Typography>
            </div>
          </div>
        ))}
      </div>
      <FeedbackAnnouncement></FeedbackAnnouncement>
    </div>

  );
}
  
export default Home;