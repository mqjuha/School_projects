import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import './blog_nav_bar.css'


export default function BlogNavbar() {

    const businessBtn = document.getElementById("business-button");
    const technologyBtn = document.getElementById("technology-button");
    const uxBtn = document.getElementById("ux-button");

    const navigate = useNavigate()

    // Navigate to different page
    const navigateToPage = (page) => {
      navigate(page);
    };

    return (
      <nav className="blog-navigation">

        <div>
          <button id="business-button" className={'blog-nav_button red-theme'} onClick={() => navigateToPage('/blog/business')}>Business</button>
          <button id="technology-button" className={'blog-nav_button blue-theme'} onClick={() => navigateToPage('/blog/technology')}>Technology</button>
          <button id="ux-button" className={'blog-nav_button yellow-theme'} onClick={() => navigateToPage('/blog/ux')}>UX</button>
        </div>

      </nav>
    );
  }