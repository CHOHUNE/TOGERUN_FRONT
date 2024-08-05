import React from 'react';
import {useParams} from 'react-router-dom';
import ReadComponent from "../../component/post/ReadComponent";
import CommentContainer from "../../component/comment/CommentContainer";


const ReadPage = () => {

    const {postId} = useParams();


    return (

        <div className="container mx-auto p-4">
            <ReadComponent postId={postId}/>
            <CommentContainer postId={postId}/>
        </div>

    );
};
export default ReadPage;
