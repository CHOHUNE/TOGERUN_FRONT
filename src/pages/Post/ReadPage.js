import React from 'react';
import {useParams} from 'react-router-dom';
import ReadComponent from "../../component/post/ReadComponent";
import CommentTotalContainer from "../../component/comment/CommentTotalContainer";


const ReadPage = () => {

    const {postId} = useParams();


    return (

        <div className="container mx-auto">
            <ReadComponent postId={postId}/>
            <CommentTotalContainer postId={postId}/>
        </div>

    );
};
export default ReadPage;
