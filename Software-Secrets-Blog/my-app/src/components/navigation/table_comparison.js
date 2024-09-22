import './table_comparison.css';

// Example of a data array that we might receive from an API
/*const test_data = [
    { navigation: '/feedback', header: "header1", feature1: 'column 1.1', feature2: "column 1.2" },
    { navigation: 'https://medium.com/@bfgmartin/what-is-a-product-manager-ce0efdcf114c', header: "header2", feature1: 'column 2.1', feature2: "column 2.2" },
    { header: "header1", feature1: 'column 3.1', feature2: "column 3.2" },
]*/

/*
const data = {
      header_row: ["Header", "Header1", "Header2"],
      content: [{
          navigation: 'link',
          items: ["header1", "row1", "row1"],
      },
      {
          navigation: 'link',
          items: ["header2", "row2", "row2"],
      },
      {
          items: ["header3", "row3", "row3"],
      }  
      ]
  } */

function Table( {whole_table_data} ) {

    //console.log(data.length); //2

    //console.log(Object.keys(data[0])); // ['header', 'feature1', 'feature2']

    //console.log(Object.keys(data[0]).length); //3

    //console.log(Object.keys(test_data[0])[0]); //header

    const only_table = whole_table_data.table;

    console.log(whole_table_data);
    console.log("Only_table", only_table);

    const getTableHeaders = ( headers ) => {

        // Headers of the table are taken from the key
        // var features = Object.keys(test_data[0]);

        return (
          <tr>
            {
              headers.map((item) => {

                if ( item !== 'navigation' ) {
                  return <th key={item} className='th-row'>{item}</th>
                }

              })
            }
          </tr>
        )
    }

    const getTableBody = ( content_data ) => {

        // Link of field
        //let navigationPage = '';

        return (!content_data) ? null : (
          <tbody>
            {content_data.map((row) => {

              const row_list = [];

              //console.log('nav', row.navigation);

              //console.log('row', row.items);

              const row_items = row.items;

              for (let i = 0; i < row_items.length; i++) {
                //console.log(i, row_items[i]);

                if ( i === 0 ) {

                  if ( "navigation" in row ) {

                    row_list.push(
                      <th key={row_items[0]} className='th-column'>
                          <a 
                            className='th-link'
                            href={`/blog/${row.navigation}`}
                            >{row_items[0]}
                          </a>
                      </th>)

                  }
                  else {
                    row_list.push( <th key={row_items[0]} className='th-column'>{row_items[0]}</th> )
                  }
                }

                else {
                  row_list.push( <td>{row_items[i]}</td> )
                }
              }

              return (
                <tr>
                  {row_list}
                </tr>
              );
              
            })}
          </tbody>
        );
      }

    return (
        <div className='table-section'>
            <table>
                {getTableHeaders(only_table.header_row)}
                {getTableBody(only_table.content)}
            </table>
        </div>

      )

}

export default Table;

/*
else if ( field[0] === 'header' ) {

                      // Let's check if the header is a link
                      if ( navigationPage !== '' ) {

                        return <th className='th-column'>
                            <Link 
                              className='th-link'
                              to={navigationPage}
                              >{field[1]}</Link>
                          </th>

                      }
                      else {
                        return <th className='th-column'>{field[1]}</th>
                      }

                    }

                    else {
                      navigationPage = '';
                      return <td>{field[1]}</td> // 0 -> keys, 1 -> values
                    }*/

/*
                  {Object.entries(row).map((pair) => {

                    //console.log(pair);

                    if ( pair[0] === 'navigation' ) {
                      navigationPage = pair[1];
                    }

                    else {

                      return getRowList(pair[1])

                    }
                    
                  })}*/