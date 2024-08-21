import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getOne, putOne } from "../../api/api";
import PostFormComponent from "./PostFormComponent";
import FetchingModal from "../common/FetchingModal";

const ModifyComponent = ({ postId }) => {
    const { data: initialPost, isLoading, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getOne(postId),
        staleTime: Infinity
    });

    if (isLoading) return <FetchingModal />;
    if (error) return <div>Error loading post: {error.message}</div>;

    // 현재 시간으로 meetingTime 설정
    const formattedPost = {
        ...initialPost,
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