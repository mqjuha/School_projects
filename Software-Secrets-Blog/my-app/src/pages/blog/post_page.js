import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import './post_page.css'
import Keyword from "../../components/keyword/keyword";
import BlogNavbar from "../../components/blog_nav_bar/blog_nav_bar";

import References from '../../components/references/references.js';

import TableComparison from '../../components/navigation/table_comparison';
import TimelineHorizontal from '../../components/navigation/timeline_horizontal.js';
import TimelineVertical from '../../components/navigation/timeline_vertical.js';

export default function PostPage(){

    // Article
    const [postInfo, setPostInfo] = useState([]);
    // Navigation component
    const [selectedNavComponent, setSelectedNavComponent] = useState(null);
    // List of references
    const [refs, setRefs] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        fetch(`https://software-secrets-blog.onrender.com/blog/${id}`)
          .then(response => {
            response.json().then(info => {
              setPostInfo(info);

              if (info.nav.nav_type === 'TimelineHor') {
                
                fetch(`https://software-secrets-blog.onrender.com/timelineHor/${info.nav.element}`)
                  .then(response => response.json())
                  .then(timelineHor => {
                    setSelectedNavComponent(<TimelineHorizontal timeline={timelineHor} />);
                  })
              } else if (info.nav.nav_type === 'TimelineVer') {

                fetch(`https://software-secrets-blog.onrender.com/timelineVer/${info.nav.element}`)
                .then(response => response.json())
                .then(timelineVer => {
                  setSelectedNavComponent(<TimelineVertical timeline={timelineVer} />);
                })
              } else if (info.nav.nav_type === 'TableComparison') {

                fetch(`https://software-secrets-blog.onrender.com/tableComponent/${info.nav.element}`)
                .then(response => response.json())
                .then(tableComp => {
                  setSelectedNavComponent(<TableComparison whole_table_data={tableComp} />);
                })
              }

              if (info.references.length !== 0) {
                const refPromises = info.references.map(ref_id => {
                  return fetch(`https://software-secrets-blog.onrender.com/reference/${ref_id}`)
                    .then(response => response.json());
                });
                
                // Odottaa, että kaikki Promise objektit ovat onnistunut
                Promise.all(refPromises).then(refComps => {
                  setRefs(refComps);
                });
              }

            });
          });
      }, []);

    if (postInfo.length == 0) return '';

    return (
        <div>
        <BlogNavbar></BlogNavbar>
        <div className={`article ${postInfo.category}`}>
            <div className="intro-element">
                <Typography variant="h3">{postInfo.title}</Typography>
                <Typography>{postInfo.date.substr(0,10)}</Typography>
                <div className="keywords">
                    {postInfo.keywords.map( word => (
                        <Keyword word={word}/>
                    ))}
                </div>
                <Typography>{postInfo.abstract}</Typography>
            </div>

            {selectedNavComponent && (
                <div className="navigation-element">
                {selectedNavComponent}
                </div>
            )}

            <div className="content-element">
                {postInfo.content.map( chapter => (
                    <Typography>{chapter}</Typography>
                ))}
            </div>
            <div className="summary-element">
                <Typography variant="h4">Summary</Typography>
                <Typography>{postInfo.summary}</Typography>
            </div>

            {refs.length > 0 && (
              <References refs={refs}></References>
            )
            }
            
        </div>
        </div>
    )
}