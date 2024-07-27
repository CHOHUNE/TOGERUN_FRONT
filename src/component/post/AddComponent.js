import React, {useState} from 'react';
import {postAdd} from "../../api/api";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../../component/common/ResultModal";
import FetchingModal from "../common/FetchingModal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postInitState} from "../../atoms/postInitState";



const AddComponent = () => {

    const [post, setPost] = useState({...postInitState})
    const {moveToList} = useCustomMove();

    const addMutation = useMutation({
        mutationFn:(post)=>postAdd(post)
    });

    const handleChangePost = (e) => {
        const {name, value} = e.target;

        setPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit =(e) => {

        e.preventDefault()

        const formData = new FormData();

        formData.append('title', post.title)
        formData.append('content', post.content)



        addMutation.mutate(formData)

        // postAdd(post).then(
        //     result => {
        //         setResult(result.id)
        //         setPost({...postInitState})
        //
        //     })

    };

    const queryClient = useQueryClient();


    const closeModal = () => {
        // setResult(null)
        queryClient.invalidateQueries('post/List')
        moveToList({page:1})
    }

    return (
    <div>
        {addMutation.isPending ? <FetchingModal/> : <></>}
        {addMutation.isSuccess ? <ResultModal title={'게시글 작성'} content={` 게시물 작성이 완료 되었습니다.`} callbackFn={closeModal}/> : <></> }
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-3xl font-bold mb-4">Create Post</h1>
                <div className="form-control">
                    <label htmlFor="title" className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name={"title"}
                        value={post.title}
                        onChange={handleChangePost}
                        required
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="content" className="label">
                        <span className="label-text">Content</span>
                    </label>
                    <textarea
                        id="content"
                        name={"content"}
                        value={post.content}
                        onChange={handleChangePost}
                        required
                        className="textarea textarea-bordered"
                    />
                </div>
                <button type="submit" className="btn btn-primary" >Create</button>

            </form>
    </div>
    );
};

export default AddComponent;
