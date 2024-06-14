import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {fetchPosts} from "../../api/api";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../../component/common/PageComponent";
import ListComponent from "../../component/post/ListComponent";

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

const ListPage = () => {


    return (

        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>
            <div className="flex justify-center mb-6">
                <Link to="/post/write" className="btn btn-primary">Create Post</Link>
            </div>

            <ListComponent/>

        </div>

    );
};


export default ListPage;
