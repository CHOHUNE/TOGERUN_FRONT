import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts } from "../../api/api";
import BasicLayout from "../../layouts/BasicLayout";

const ListPage = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (

        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>
            <div className="flex justify-center mb-6">
                <Link to="/post/write" className="btn btn-primary">Create Post</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">
                                <Link to={`/post/${post.id}`} className="link link-primary">{post.title}</Link>
                            </h2>
                            <p>{post.body}</p>
                            <div className="card-actions justify-end">
                                <Link to={`/post/${post.id}`} className="btn btn-outline btn-primary">Read More</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default ListPage;
