import React from 'react';
import {useParams} from "react-router-dom";
import ModifyComponent from "../../component/post/ModifyComponent";

function ModifyPage(props) {


    const {postId} = useParams();

    return (
        <div className="container mx-auto p-4">
            <ModifyComponent postId={postId}/>
        </div>

    );
}

export default ModifyPage;