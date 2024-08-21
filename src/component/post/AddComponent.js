import React from 'react';
import { postAdd } from "../../api/api";
import { postInitState } from "../../atoms/postInitState";
import PostFormComponent from "./PostFormComponent";

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