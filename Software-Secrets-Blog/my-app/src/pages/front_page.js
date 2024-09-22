import * as React from 'react';
import { useEffect, useState } from "react";

import Blogfilter from '../components/blog_filter/blog_filter';
import BlogNavbar from '../components/blog_nav_bar/blog_nav_bar';
import Post from '../components/post/post';
import Postlist from '../components/postList/postList';

import './blog_page.css'

import References from '../components/references/references.js';
import TableComparison from '../components/navigation/table_comparison.js';
import TimelineHorizontal from '../components/navigation/timeline_horizontal.js';
import TimelineVertical from '../components/navigation/timeline_vertical.js';
import blog_banner from '../images/blog_banner.jpg'

/*
let x = true;
let y = true;
let z = true;*/

function FrontPage() {

  console.log("front page");

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let x = true;

    if (x) {

    console.log('fetch');
      fetch('https://software-secrets-blog.onrender.com/blog', {method: "GET"}).then(response => {
        console.log(response);
          response.json().then(postArr => {
              setPosts(postArr);
          });
      });
    }
    return () => {setPosts([])}

  }, []);

  setTimeout(() => {
    document.getElementById('banner_image').src = blog_banner;
    document.getElementById("banner-header").innerHTML = '';
  }, 60);

  /*const [timelineVer, setTimelineVer] = useState(null);
  useEffect(() => {

    console.log("X=", x);

    if (x) {

      fetch('https://software-secrets-blog.onrender.com/blog', {method: "GET"}).then
      (response => {
          console.log(response);
          response.json().then( verLine => {
            console.log(verLine);
            setTimelineVer(verLine);
          });
      });

      //x = false;

      return () => {setTimelineVer(null)}
    }
  }, []);

  console.log(timelineVer); */

  /*const [timelineHor, setTimelineHor] = useState(null);
  useEffect(() => {

    console.log("Y=", y);

    if (y) {

      fetch('https://software-secrets-blog.onrender.com/blog', {method: "GET"}).then
      (response => {
          console.log(response);
          response.json().then( horLine => {
            console.log(horLine);
            setTimelineHor(horLine);
          });
      });

      //y = false;

      return () => {setTimelineHor(null)}
    }
  }, []);

  console.log(timelineHor);*/

  /*
  const [references, setReferences] = useState([]);
  useEffect(() => {

    console.log("Z=", z);

    if (z) {

      fetch('https://software-secrets-blog.onrender.com/blog', {method: "GET"}).then
      (response => {
          console.log(response);
          response.json().then( refs => {
            console.log("Refs:", refs);
            setReferences(refs);
          });
      });

      //z = false;

      return () => {setReferences([])}
    }
  }, []);

  console.log(references);*/

  /*const [table, setTableContent] = useState([]);
  useEffect(() => {
  
    fetch('https://software-secrets-blog.onrender.com/blog', {method: "GET"}).then
    (response => {
        console.log(response);
        response.json().then( content => {
          console.log("Table:", content);
          setTableContent(content);
        });
    });
    
    return () => {setTableContent([])}

  }, []);

  console.log(table);

  if ( table.length === 0 ) {
    return ""
  }*/

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      }}>

      <BlogNavbar></BlogNavbar>

      <p>Front Page of Blog</p> 
      <div className="list">
        {posts.length > 0 && posts.map( post => (
            <Post {...post} />
        ))}

      </div>
    </div>
  );
}
  
export default FrontPage;

//<TimelineVertical timeline={timelineVer}></TimelineVertical>
//<TimelineHorizontal timeline={timelineHor}></TimelineHorizontal>
//<References refs={references}></References>