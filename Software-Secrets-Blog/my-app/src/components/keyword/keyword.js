import { Typography } from "@mui/material";

import './keyword.css'

export default function Keyword({word}){

    return (
        <div className="text-area">
            <Typography>{word}</Typography>
        </div>
    )
}