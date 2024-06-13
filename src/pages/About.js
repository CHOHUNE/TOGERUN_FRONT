import React from 'react';
import BasicLayout from "../layouts/BasicLayout";
import {Link} from "react-router-dom";

function About(props) {
    return (
        <BasicLayout>

            <div className={"text-3xl"}> About Page</div>
            <Link to={"/main"}> Main </Link>
        </BasicLayout>

    );
}

export default About;