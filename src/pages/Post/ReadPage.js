import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { getOne } from "../../api/postAPI";
import ReadComponent from "../../component/post/ReadComponent";
import CommentTotalContainer from "../../component/comment/CommentTotalContainer";
import useCustomLogin from "../../hooks/useCustomLogin";

const ReadPage = () => {
    const { postId } = useParams();
    const { loginState } = useCustomLogin();

    const { data: post, isLoading, isError } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getOne(postId),
        staleTime: 1000 * 60 * 30
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading post</div>;

    return (
        <div className="container mx-auto">
            <ReadComponent post={post} postId={postId} loginState={loginState} />
            <CommentTotalContainer
                postId={postId}
                postAuthorNickname={post.nickname}
                loginState={loginState}
            />
        </div>
    );
};

export default ReadPage;