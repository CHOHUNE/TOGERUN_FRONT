
import React, {useEffect} from 'react';
import {fetchPostById} from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import { Link} from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";


const initState ={
    id:0,
    title:''
    ,user:''
    ,localDate:''
    ,content:''

}

function ReadComponent({postId}) {

    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.posts.find((p) => p.id === Number(postId)));


    useEffect(() => {
        dispatch(fetchPostById(postId));
    }, [dispatch, postId]);


    const {moveToList, moveToModify} = useCustomMove();

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h1 className="card-title text-3xl mb-4">{post.title}</h1>
                <h3 className="text-xl mb-2">{postId} 번 게시물</h3>
                <p className="mb-4">{post.content}</p>
                <div className="card-actions justify-end">
                    <Link to={`/post/chat/${postId}`} className="btn btn-outline btn-primary">1:1 채팅하기</Link>

                    <button className={"btn btn-outline btn-neutral"} onClick={() => moveToModify(postId)}>Modify
                    </button>
                    <button className={"btn btn-outline btn-secondary"} onClick={moveToList}>Back</button>
                    <button className={"btn btn-outline btn-error"}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default ReadComponent;