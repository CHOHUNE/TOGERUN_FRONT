import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import PageComponent from "../common/PageComponent";
import { useDispatch, useSelector } from "react-redux";
import useCustomMove from "../../hooks/useCustomMove";
import { fetchPosts } from "../../api/api";

function ListComponent(props) {
    const dispatch = useDispatch();
    const { page, refresh, size, moveToList, moveToRead } = useCustomMove();
    const serverData = useSelector((state) => state.post.serverData);

    useEffect(() => {
        dispatch(fetchPosts({ page, size }));
    }, [dispatch, page, size, refresh]);

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">Title</th>
                    <th className="text-center">Actions</th>
                    <th className="text-center">Date</th>
                </tr>
                </thead>
                <tbody>
                {serverData.dtoList.map((post) => (
                    <tr key={post.id}>
                        <td className="text-center">{post.id}</td>
                        <td className="text-center">
                            <Link to={`/post/${post.id}`} className="link link-primary">{post.title}</Link>
                        </td>
                        <td className="text-center">
                            <Link to={`/post/${post.id}`} className="btn btn-outline btn-primary">Read More</Link>
                        </td>
                        <td className="text-center">{post.localDate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <PageComponent serverData={serverData} movePage={moveToList} />
        </div>
    );
}

export default ListComponent;
