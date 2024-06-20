import React, {useEffect, useState} from 'react';
import ResultModal from "../common/ResultModal";
import {useDispatch, useSelector} from "react-redux";
import {fetchPostById, putOne} from "../../api/api";
import useCustomMove from "../../hooks/useCustomMove";

function ModifyComponent({postId}) {
    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.serverData.dtoList.find((p) => p.id === Number(postId)));
    const [localPost, setLocalPost] = useState({title: '', content: ''});
    const [result, setResult] = useState();
    const {moveToList, moveToRead} = useCustomMove();

    useEffect(() => {
        dispatch(fetchPostById(postId));
    }, [dispatch, postId]);

    useEffect(() => {
        if (post) {
            setLocalPost({title: post.title, content: post.content});
        }
    }, [post]);

    const handleChangePost = (e) => {
        const {name, value} = e.target;
        setLocalPost((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleClickModify = (e) => {
        e.preventDefault();
        putOne({...post, ...localPost}).then(
            result => {
                setResult("Modified");
            }
        )
    };

    const closeModal = () => {
        setResult(null);
        moveToRead(postId);
    }

    return (
        <div>
            {result ? <ResultModal title={'게시글 수정'} content={` ${result} 번 게시물 수정이 완료 되었습니다.`}
                                   callbackFn={closeModal}/> : <></>}
            <form onSubmit={handleClickModify} className="space-y-4">
                <h1 className="text-3xl font-bold mb-4">Modify Post</h1>
                <div className="form-control">
                    <label htmlFor="title" className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={localPost.title}
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
                        name="content"
                        value={localPost.content}
                        onChange={handleChangePost}
                        required
                        className="textarea textarea-bordered"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Modify</button>
            </form>
        </div>
    );
}

export default ModifyComponent;
