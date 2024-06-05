import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createPost} from "../api/api";

const CreatePostForm = () => {

    const [title, setTitle] = useState(' ')
    const [content, setContent] = useState(' ')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        await dispatch(createPost({title, content}));
        navigate('/');

    }


    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Post</h1>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create</button>
        </form>
    );
};

export default CreatePostForm;