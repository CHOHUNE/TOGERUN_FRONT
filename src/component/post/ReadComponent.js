import React, { useEffect, useState } from 'react';
import { deleteOne, fetchPostById } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

function ReadComponent({ postId }) {
    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.serverData.dtoList.find((p) => p.id === Number(postId)));
    const [result, setResult] = useState();

    useEffect(() => {
        dispatch(fetchPostById(postId));
    }, [dispatch, postId]);

    const { moveToList, moveToModify } = useCustomMove();

    function handleClickDelete() {
        deleteOne(postId).then(result => {
            setResult(postId);
        });
        console.log(result);
    }

    const closeModal = () => {
        setResult(null);
        moveToList();
    }

    if (!post) {
        return <div>Loading..</div>;
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h1 className="card-title text-3xl mb-4">{post.title}</h1>
                    <span className="text-sm text-gray-500">{post.localDate}</span>
                </div>
                <h3 className="text-xl mb-2">{postId} 번 게시물</h3>
                <p className="mb-4">{post.content}</p>
                <div className="card-actions justify-end">
                    <Link to={`/post/chat/${postId}`} className="btn btn-outline btn-primary">1:1 채팅하기</Link>
                    <button className="btn btn-outline btn-neutral" onClick={() => moveToModify(postId)}>Modify</button>
                    <button className="btn btn-outline btn-secondary" onClick={moveToList}>Back</button>
                    <button className="btn btn-outline btn-error" onClick={handleClickDelete}>Delete</button>
                </div>
            </div>
            {result ? <ResultModal title={'게시글 삭제'} content={` ${result} 번 게시물 삭제가 완료 되었습니다.`} callbackFn={closeModal}/> : <></>}
        </div>
    );
}

export default ReadComponent;
