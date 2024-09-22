import './timeline_horizontal.css'

/*const test_items = [
	{ link: '/feedback', name: 'Moi', active: true, },
	{ link: 'https://medium.com/@bfgmartin/what-is-a-product-manager-ce0efdcf114c', name: 'Step 2', active: true, },
    { name: 'Step 3', active: true, },
    { name: 'Step 4', active: false, },
]*/

function Timeline( {timeline} ) {

    console.log("TIMELINEHOR:", timeline);

    if (!timeline) {
        return <div></div>;
    }

    const dots = timeline.dots;

    // Let's calculate the progress of the timelime
    // k active — m items: (k — 1) / (m — 1)
    const totalItems = dots.length;
	const numberOfActiveItems = dots.filter(item => item.active).length;
	const progressBarWidth = totalItems > 1 ? (numberOfActiveItems - 1) / (totalItems - 1) * 100 : 0;


	return (
        <div className='timeline-section'>
            <div className="timeline">

                <div className="progress" style={{ width: `${progressBarWidth}%`}}></div>

                <div className="timeline-items" id='line'>

                    {dots.map((item, i) => (
                        <div key={i} className={"timeline-item" + (item.active ? ' active' : '')}>
                            <div className="timeline-content">
                                { "link" in item ?
                                (
                                    <a 
                                        className='timeline-hor-link'
                                        href={`/blog/${item.link}`}
                                        >{item.text}
                                    </a>
                                ) : ( 
                                    <div>{item.text}</div>)
                                }
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
	)

}

export default Timeline;