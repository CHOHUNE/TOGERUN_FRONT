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
        <div className="container mx-auto p-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="card-title text-3xl mb-4">{post.title}</h1>
                    <h3 className="text-xl mb-2">{postId} 번 게시물</h3>
                    <p className="mb-4">{post.content}</p>
                    <div className="card-actions justify-end">
                        <Link to={`/chats/${postId}`} className="btn btn-outline btn-primary">1:1 채팅하기</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PostDetail;
