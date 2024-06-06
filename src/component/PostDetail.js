// src/components/PostDetail.js
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {fetchPostById} from "../api/api";

const PostDetail = () => {
    const { postId } = useParams();
    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.posts.find((p) => p.id === Number(postId)));

    useEffect(() => {
        dispatch(fetchPostById(postId));
    }, [dispatch, postId]);

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <h1>제목 : {post.title}</h1>
            <h3>{postId} 번 게시물</h3>
            <p>컨텐츠 : {post.content}</p>
            <Link to={`/chats/${postId}`}>1:1 채팅하기</Link>
        </div>
    );
};

export default PostDetail;
