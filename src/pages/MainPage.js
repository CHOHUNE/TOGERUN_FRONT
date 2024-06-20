import React from 'react';
import BasicLayout from "../layouts/BasicLayout";
import {Link} from "react-router-dom";

function MainPage(props) {
    return (<BasicLayout>
            <div className={"text-3xl "}>
                MainPage
            </div>
            <Link to={"/about"}>About Page</Link>
        </BasicLayout>

    );
}

export default MainPage;