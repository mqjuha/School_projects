import { Fragment } from "react";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


import mainTheme from './../../themes/main_theme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState, createRef } from "react";

import './blog_filter.css'


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// get geywords from db
const keywords = [
'business model',
'revenue streams',
'design approach',
'experience design',
'user study',
'requirements',
'usability',
'testing',
'software development',
'process',
'software architecture',
'design pattern',
'programming',
'model',
'experience goals'
]

// get types from db
const types = [
  'informatic reading',
  'tutorial',
  'tips and tricks'
]

const sortOptions = [
  'From latest to oldest',
  'Alphabetical order',
  'From oldest to latest'
]


export default function Blogfilter ({changeFilters}) {

  const [inputKeywords, setInputKeywords] = useState([]);
  const [inputTypes, setInputTypes] = useState([]);
  const [inputSort, setInputSort] = useState("From latest to oldest");


  function filtersChanged(e, value) {

    if (e.currentTarget.id.includes('by-keywords')){
      setInputKeywords(value);
      changeFilters(inputSort, [...value, ...inputTypes])
    }
    if (e.currentTarget.id.includes('by-type')){
      setInputTypes(value);
      changeFilters(inputSort, [...inputKeywords, ...value])
    }
    if (e.currentTarget.id.includes('sort-by')){
      setInputSort(value);
      changeFilters(value, [...inputKeywords, ...inputTypes])
    }
 
  }


    return (
      <Fragment>
        <div className="filter-section">
          <div className="filters">
            <Autocomplete
              className="filter"
              multiple
              id="filter-by-keywords"
              options={keywords}
              value={inputKeywords}
              onChange={(event, newValue) => filtersChanged(event, newValue)}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select keywords" placeholder="Keyword" />
              )}
            />
            <Autocomplete
              className="filter"
              multiple
              id="filter-by-type"
              options={types}
              value={inputTypes}
              onChange={(event, newValue) => filtersChanged(event, newValue)}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Filter by type" placeholder="Type" />
              )}
            />
          </div>
          <Autocomplete
            className="sort"
            disablePortal
            id="sort-by"
            options={sortOptions}
            value={inputSort}
            onChange={(event, newValue) => filtersChanged(event, newValue)}
            renderInput={(params) => <TextField {...params} label="Sort by" />}
          />
        </div>
      </Fragment>
    )
}
