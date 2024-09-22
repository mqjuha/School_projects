import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import ReactLogo from './../../logo.svg';
//import '../../themes.css'

import './post.css'

export default function Post({_id, category, title, cover, abstract, nav, content, summary, references}){

    const [themeColor, setThemeColor] = useState('');
    
    useEffect(() => {

        if ( category === 'business' ) {
            setThemeColor("red-theme")
        }
        else if ( category === 'ux') {
            setThemeColor("yellow-theme")
        }
        else {
            setThemeColor("blue-theme")
        }
    })


    return (
        <div className={`post ${themeColor}`}>
            <NavLink to={`/blog/${_id}`} className="link">
                <div className="image">
                    <img className="img" src={ReactLogo}/>
                </div>
                <div className="text">
                    <Typography>{title}</Typography>
                    <Typography>{abstract}</Typography>
                </div>
            </NavLink>
        </div>
    )
}