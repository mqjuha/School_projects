import * as React from 'react';
import { useEffect, useState } from "react";
import { Typography } from '@mui/material';

import Blogfilter from "../../components/blog_filter/blog_filter";
import BlogNavbar from "../../components/blog_nav_bar/blog_nav_bar";
import Post from '../../components/post/post';

import './blog_layout.css'

export default function Technology() {

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [order, setOrder] = useState('');

  const includesAll = (arr, values) => values.every(v => arr.includes(v));

  function filterByKeywords(item) {
    return (includesAll(item.keywords, filters));
  }

  function sortPosts() {
    let sorted = posts;

    if (order === 'From latest to oldest') {
      sorted.sort((a,b) =>
      a.date.localeCompare(b.date));
      console.log(sorted);
      setFilteredPosts(sorted)
      
    }

    if (order === 'Alphabetical order') {
      sorted.sort(function(a,b){
        var titleA = a.title.toUpperCase();
        console.log(titleA)
        var titleB = b.title.toUpperCase();
        console.log(titleB)
        return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
      });
      
      console.log(sorted);
      setFilteredPosts(sorted)
      
    }

    if (order === 'From oldest to latest') {
      sorted.sort((a,b) =>
      a.date.localeCompare(b.date));
      sorted.reverse();
      console.log(sorted);
      setFilteredPosts(sorted)
      
    }

    
  }

  const changeFilters = (ord, ftr) => {
    setFilters(ftr)
    setOrder(ord)

    console.log(ftr)

    const filtered = posts.filter(filterByKeywords);
    
    setFilteredPosts(filtered)
    sortPosts()
  }

  useEffect(() => {
    let x = true;

    if (x) {

    console.log('fetch business');
      fetch('https://software-secrets-blog.onrender.com/blog', {method: "GET"}).then(response => {
        console.log(response);
          response.json().then(postArr => {
              setPosts(postArr);
              setFilteredPosts(postArr)
          });
      });
    }

    return () => {setPosts([])}

  }, []);

  if ( filteredPosts.length === 0 ){
    return (
      <div className="top-section">
      <BlogNavbar></BlogNavbar>
      <Blogfilter changeFilters={changeFilters}></Blogfilter>
        <div className='error-message'>
          <Typography className='message'>No results.</Typography>
        </div>
      </div>
    )
  }

    return (
        <div className="top-section">
            <BlogNavbar></BlogNavbar>
            <Blogfilter changeFilters={changeFilters}></Blogfilter>
            <div className="list">
                {posts.length > 0 && posts.map( post => (
                    <Post {...post} />
            ))}

            </div>
        </div>

    );
};