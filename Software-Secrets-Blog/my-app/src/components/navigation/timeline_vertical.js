import './timeline_vertical.css'

import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { styled } from '@mui/material/styles';

import {Link} from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';

/*const test_items = [
	{ link: '/feedback', main_text: 'MAIN TEXT', dot_color: 'secondary', },
	{ link: 'https://medium.com/@bfgmartin/what-is-a-product-manager-ce0efdcf114c', main_text: 'MAIN TEXT 2', secondary_text: 'secondary', dot_color: 'secondary', },
    { main_text: 'MAIN TEXT 3', secondary_text: 'secondary', dot_color: 'success', },
    { main_text: 'MAIN TEXT 4', secondary_text: null, dot_color: 'success', },
]*/

function TimelineVertical( {timeline} ) {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md')); // 900px

    if (!timeline) {
        return <div></div>;
    }

    const dots = timeline.dots;

	return (
        <div className='timeline-ver-section'>
            <Timeline position={ matches ? 'alternate' : 'left'}>

                {dots.map((item, i) => (

                    <TimelineItem>
                        <TimelineOppositeContent display={ matches ? 'block' : 'none' }>{item.secondary_text}</TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color='success' />
                            { i !== dots.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            { "link" in item ?
                            (
                                <a 
                                    className='timeline-ver-link'
                                    href={`/blog/${item.link}`}
                                    ><strong>{item.main_text}</strong>
                                </a>
                            ) : ( 
                                <div><strong>{item.main_text}</strong></div>)
                            }
                        </TimelineContent>
                    </TimelineItem>
                    
                ))}

            </Timeline>

        </div>
	)

}

export default TimelineVertical;