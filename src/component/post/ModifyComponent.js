import React from 'react';
import { useQuery } from "@tanstack/react-query";
import PostFormComponent from "./PostFormComponent";
import FetchingModal from "../common/FetchingModal";
import {getOne, putOne} from "../../api/postAPI";
import LoadingSpinner from "../common/LoadingSpinner";

const ModifyComponent = ({ postId }) => {




    const { data: initialPost, isLoading, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getOne(postId),
        staleTime: Infinity
    });

    if (isLoading) return <LoadingSpinner fullScreen={true}/>;
    if (error) return <div>Error loading post: {error.message}</div>;

    const extractPostData = (data) => {
        if (Array.isArray(data) && data.length === 2 && typeof data[0] === 'string') {
            return data[1];
        }
        return data;
    };

    const postData = extractPostData(initialPost);

    // 현재 시간으로 meetingTime 설정
    const formattedPost = {
        ...postData,
        meetingTime: new Date() // DB 상의 시간이 아닌 현재 시간으로 설정
    };

    return (
        <PostFormComponent
            initialPost={formattedPost}
            onSubmit={(formData) => putOne(postId, formData)}
            submitButtonText="게시글 수정"
            title="게시글 수정"
        />
    );
};

export default ModifyComponent;