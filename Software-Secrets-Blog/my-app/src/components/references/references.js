import {useRef, Fragment} from 'react';
import {Link} from 'react-router-dom';

import './references.css'

//const test_data = ["M. Erikson, What is a Product Manager?, Medium, 18.2.2016. Available: https://medium.com/@bfgmartin/what-is-a-product-manager-ce0efdcf114c", "Source 2", "P. Rodriguez, C. Urquhart and E. Mendes, A Theory of Value-Based Feature Se-lection in Software Engineering, IEEE Transaction on software engineering, 2022, vol. 48, no. 2."];
// date(year, mont, day)

/*
const test_data = [
    {
        authors: 'Authors',
        year: new Date(2023, 10, 10),
        title: 'Title',
        source: [{
            book_title: 'Book title',
            edition: 'Edition',
            publisher: 'Publisher',
            address: 'Address',
        }],
        pages: 'Pages',
        series: 'Series',
        access_date: new Date(2023, 10, 10),
        url: 'pööööööööööööööööööööööööööööööö',
    },
    {
        authors: null,
        year: new Date(2023, 10, 10),
        title: 'Title',
        source: [{
            journal_name: 'Journal name',
            volumer: 3,
            number: 3,
        }],
        pages: 'Pages',
        series: 'Series',
        access_date: null,
        url: null,
    }
]*/

//const test = { moi: 'hei'};


function CreateList (props) {

    const ref = props.reference;
    const string_list = [];
    const link = [];

    Object.entries(ref).map(([key, value]) => {

        console.log(typeof value);

        if ( value === null ) {
            return;
        }
        else if ( key === '_id' ) {
            return;
        }
        else if ( key === '__v' ) {
            return;
        }
        else if ( key === 'access_date' ) {
            const date = new Date(value);
            string_list.push("Available (" + date.toLocaleDateString() +"): " );
        }
        else if ( key === 'year' ) {
            const date = new Date(value);
            string_list.push("(" + date.toLocaleDateString() + "). " );
        }
        else if ( key === 'source' ) {

            value.map((source) => {
                Object.entries(source).map(([s_key, s_value]) => {
                    if ( s_value === null ) {
                        return;
                    }
                    else if ( s_key === '_id' ) {
                        return;
                    }
                    else {
                        string_list.push(s_value + ". ")
                    }
                }
                )
            }
            )

        }
        else if ( key === 'url' ) {
            link.push(value);
        }
        else {
            string_list.push(value + ". ");
        }
    });

    return (
        <div className='ref-text'>
            <div>{string_list}</div>
            <a className='href' href={link}>{link}</a>
        </div>
    )
}

function RefList(props) {
    const data = props.database;

    return (
        <ul className='ul'>
            { Array.isArray(data) ?
            (
                data.map((data) => (
                    <li className='li'>
                        <CreateList reference={data}></CreateList>
                    </li>
                ))  
            ) : (                
                <li className='li'>
                    <CreateList reference={data}></CreateList>
                </li>
            )
            }

        </ul>
    );
};

export default function ReferencesBox ( {refs} ) {

    console.log(refs);

    return (
        <Fragment>
            <div className='ref-section'>
                <h2 className='ref-header'>References</h2>
                <RefList database={refs}></RefList>
            </div>
        </Fragment>
    );
}



/*
                            {data.authors}. ({data.year.toLocaleDateString()}). {data.title}. {data.pages}. {data.series}.
                        { data.url !== null ?
                        (
                            <div>
                                Available ({data.access_date.toLocaleDateString()}): 
                                <a className='href' href={data.url}>{data.url}</a>
                            </div>
                        ) : (
                            <div></div>
                        )
                        }*/

/*
            { pair[0] === 'access_date' ?
            (
                <div>
                    Available ({pair[1].toLocaleDateString()}): 
                    
                </div>
            ) : (
                <div>{pair[1]}.</div>
            )
            }*/

/*
                        {
                            Object.entries(ref).map(([key, value]) => (
                                <AddPoint pair={[key, value]}></AddPoint>
                            )
                            )
                        }*/
/*
function AddPoint (props) {

    const pair = props.pair;

    return (
        <div>

            {(() => {
                if ( pair[1] === null ) {
                return (
                    <div></div>
                )
                } else if ( pair[0] === 'year' ) {
                return (
                    <div>{pair[1].toLocaleDateString()}</div>
                )
                } else if ( pair[0] === 'access_date' ) {
                return (
                    <div>Available ({pair[1].toLocaleDateString()}):</div>
                )
                } else if ( pair[0] === 'url' ) {
                return (
                    <a className='href' href={pair[1]}>{pair[1]}</a>
                )
                } else if ( pair[0] === 'source' ) {
                    console.log(pair[1]);
                return (
                    <div> 
                        {
                            pair[1].map((source) => (
                                   Object.entries(source).map(([key, value]) => (
                                        <div>{value}</div>
                                   )
                                   )
                            ))
                        }
                    </div>
                )
                } else {
                return (
                    <div>{pair[1]}.</div>
                )
                }
            })()}

        </div>
    )

};
*/