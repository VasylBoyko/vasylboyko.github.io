import React, {Component} from 'react';
import {Link} from "react-router-dom";

export default class Navigation extends Component {
    render() {
        return (
            <div>
                <Link to={"/"}>Home</Link>
                <Link to={"/help"}>Help</Link>
                <Link to={"/about_us"}>AboutUs</Link>              
            </div>
        );
    }
}