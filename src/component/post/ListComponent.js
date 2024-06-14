import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import PageComponent from "../common/PageComponent";
import {useDispatch, useSelector} from "react-redux";
import useCustomMove from "../../hooks/useCustomMove";
import {fetchPosts} from "../../api/api";

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
};

function ListComponent(props) {

    const dispatch = useDispatch();


    const {page,refresh,size,moveToList,moveToRead} = useCustomMove();

    const serverData = useSelector((state) => state.post.serverData);


    useEffect(() => {
        dispatch(fetchPosts({page, size})).then((result) => {
        });

    }, [page,size,refresh]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serverData.dtoList.map((post) => (
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

            <PageComponent serverData={serverData} movePage={moveToList}/>


        </div>
    );
}

export default ListComponent;