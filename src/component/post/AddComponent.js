import React from 'react';
import { postInitState } from "../../atoms/postInitState";
import PostFormComponent from "./PostFormComponent";
import {postAdd} from "../../api/postAPI";

const AddComponent = () => {
    return (
        <PostFormComponent
            initialPost={postInitState}
            onSubmit={postAdd}
            submitButtonText="게시글 작성"
            title="게시글 작성"
        />
    );
};

export default AddComponent;