import React, {useEffect} from 'react';
import {useParams, Link, useNavigate, useSearchParams, createSearchParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPostById} from "../../api/api";

const ReadPage = () => {
    const {postId} = useParams();
    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.posts.find((p) => p.id === Number(postId)));
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();

    useEffect(() => {
        dispatch(fetchPostById(postId));
    }, [dispatch, postId]);

    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1;
    const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10
    const queryStr = createSearchParams({page, size}).toString()




    const moveToModify =(tno)=>{

        navigate({
            pathname:`/post/modify/${postId}`,
            search:queryStr
        })
    }

    const moveToList = () => {
        navigate({
            pathname: `/post/list`,
            search: queryStr
        })
    }







    if (!post) return <div>Loading...</div>;

    return (

        <div className="container mx-auto p-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="card-title text-3xl mb-4">{post.title}</h1>
                    <h3 className="text-xl mb-2">{postId} 번 게시물</h3>
                    <p className="mb-4">{post.content}</p>
                    <div className="card-actions justify-end">
                        <Link to={`/post/chat/${postId}`} className="btn btn-outline btn-primary">1:1 채팅하기</Link>

                        <button className={"btn btn-outline btn-neutral"} onClick={() => moveToModify(postId)}>Modify</button>
                        <button className={"btn btn-outline btn-secondary"} onClick={moveToList}>Back</button>
                        <button className={"btn btn-outline btn-error"}>Delete</button>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default ReadPage;
