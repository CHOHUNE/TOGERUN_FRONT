import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {fetchPosts} from "../api/api";

const PostList = () => {

    const dispatch = useDispatch();
    //useDispatch 란 ? dispatch를 사용할 수 있게 해주는 hook
    //Dispatch? action을 reducer로 보내는 함수
    //action ? type을 가지는 객체
    // reducer? action을 받아서 state를 변경하는 함수

    const posts = useSelector((state)=>state.post.posts);
    //useSelector 란 ? state를 가져올 수 있게 해주는 hook

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <div>
            <h1>Posts</h1>
            <Link to={"/post"}>Create Post</Link>
            <ul>
                {posts.map((post)=>(
                    <li key={post.id}>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>


        </div>
    );
};

export default PostList;