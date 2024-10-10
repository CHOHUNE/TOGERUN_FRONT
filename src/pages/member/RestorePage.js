import React from 'react';
import BasicLayout from "../../layouts/BasicLayout";
import RestoreComponent from "../../component/member/RestoreComponent";
import {useParams} from "react-router-dom";

function RestorePage(props) {

    const {userId} = useParams();

    return (
        <BasicLayout>
            <RestoreComponent userId={userId} />
        </BasicLayout>
    );
}

export default RestorePage;