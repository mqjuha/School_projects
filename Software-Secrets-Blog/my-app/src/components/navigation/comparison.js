import { Fragment } from "react";
import ReactLogo from './../../logo.svg';

import './comparison.css'
import { Typography } from "@mui/material";

export default function ComparisonDiagram ({variant = "comp2"|"comp3", titles = [], contents = []}){

    const renderContent = () => {
        switch (variant) {
            case 'comp2':
                return (
                    <div className="container">
                        <div className="circle first">
                            <Typography>{titles[0]}</Typography>
                            <Typography className="box-context">{contents[0]}</Typography>
                        </div>
                        <div className="circle second">
                            <Typography>{titles[1]}</Typography>
                            <Typography className="box-context">{contents[1]}</Typography>
                        </div>
                    </div>
                );
            case 'comp3':
                return (
                    <div className="container higher">
                        <div className="circle first">
                            <div className="textbox">
                                <Typography>{titles[0]}</Typography>
                                <Typography className="box-context">{contents[0]}</Typography>
                            </div>
                        </div>
                        <div className="circle second">
                            <div className="textbox">
                                <Typography>{titles[1]}</Typography>
                                <Typography className="box-context">{contents[1]}</Typography>
                            </div>
                        </div>
                        <div className="circle third">
                            <div className="textbox">
                                <Typography>{titles[2]}</Typography>
                                <Typography className="box-context">{contents[2]}</Typography>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="comparison">
            <Fragment>
                {renderContent()}
            </Fragment>
        </div>

    );
}
