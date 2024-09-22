import './App.css';
import './themes.css';
import './layout.css';
import './component_styles.css';
import './components/nav_bar/nav_bar.css';

import React, { useState } from "react";

import Navbar from './components/nav_bar/nav_bar.js';
import Highlights from './components/highlights/highlights';
import Endbar from './components/end_bar/end_bar';
import Blogfilter from './components/blog_filter/blog_filter';
import Home from './pages/home_page';
import About from './pages/about_us_page';
import Feedback from './pages/feedback_page';
import Blog from './pages/front_page';

import mainTheme from './themes/main_theme';
import redTheme from './themes/red_theme';
import blueTheme from './themes/blue_theme';
import yellowTheme from './themes/yellow_theme';

import { Routes, Route, Outlet } from 'react-router-dom';
import { Button, ThemeProvider, Typography, createTheme, Paper, CssBaseline} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import BlogNavbar from './components/blog_nav_bar/blog_nav_bar';
import Business from './pages/blog/business';
import Technology from './pages/blog/technology';
import Ux from './pages/blog/ux';
import PostPage from './pages/blog/post_page';

import banner from './images/home_page_banner.jpg'

function BaseStructure() {
  return (
    <div className='base-layout'>
      <div className='banner'>
        <img id='banner_image' src={banner}/>
        <h1 id='banner-header'></h1>
      </div>
      <Navbar className='top_bar'/>
      <Outlet/>
      <Endbar/>
    </div>
  );
}

function App() {

  const [colorTheme, updateTheme] = useState("blue-theme");

  const themeMain = createTheme(mainTheme);
  const themeRed = createTheme(redTheme);
  const themeBlue = createTheme(blueTheme);
  const themeYellow = createTheme(yellowTheme);

  const toggleTheme = () => {

  };

  const classes = {
    'test_button': true,
    'button': true,
  }

  return (
    <ThemeProvider theme={themeMain}>
      <CssBaseline/>
      <div>
        <Routes>
          <Route element={<BaseStructure/>}>
            <Route path="/" element={<Home />} />
            <Route path="aboutus" element={<About />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="blog" element={<Blog />} />
            <Route path='blog/business' element={<Business />}/>
            <Route path='blog/technology' element={<Technology />}/>
            <Route path='blog/ux' element={<Ux />}/>
            <Route path='/blog/:id' element={<PostPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
