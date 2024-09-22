import { useEffect, useState } from "react";
import Post from "../post/post";

import './postList.css'

export default function Postlist() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch('https://software-secrets-blog.onrender.com/blog').then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);
    
    return (
        <div className="list">
            {posts.length > 0 && posts.map( post => (
                <Post {...post} />
            ))}

        </div>
    );

    /*
                
    */
}