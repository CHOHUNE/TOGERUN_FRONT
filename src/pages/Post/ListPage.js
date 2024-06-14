import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useSearchParams} from "react-router-dom";
import {fetchPosts} from "../../api/api";
import PageComponent from "../../component/common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";

const initState ={
    id:0,
    title:''
    ,user:''
    ,localDate:''
    ,content:''

}

const ListPage = () => {
    const dispatch = useDispatch();


    const {page, refresh, size, moveToList} = useCustomMove();
    const [serverData, setServerData] = useState(initState)

    // useEffect(() => {
    //     getList({page, size}).then(data=>{
    //         console.log(data)
    //         serverData(data);
    //     })
    // }, [page,size,refresh]);


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

                {/*<PageComponent serverData={serverData} movePage={moveToList}/>*/}

            </div>
        </div>

    );
};


export default ListPage;
