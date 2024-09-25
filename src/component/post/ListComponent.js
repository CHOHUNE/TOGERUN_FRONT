import React, {useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import FetchingModal from "../common/FetchingModal";
import {EyeIcon} from "@heroicons/react/16/solid";
import {MapPinIcon} from "@heroicons/react/20/solid";
import {getList} from "../../api/postAPI";

const initState ={

    dtoList:[],
    pageNumList: [],
    pageRequestDTO: [],
    prev:false,
    next:false,
    totalCount: 0,
    prevPage: 0,
    nextPage:0,
    totalPage:0,
    current:0,


}

function ListComponent(props) {
    const {page, refresh, size, moveToList, keyword} = useCustomMove();

    const {data, isFetching} = useQuery({
        queryKey: ['post/List', {page, size, refresh, keyword}],
        queryFn: () => getList({page, size, keyword}),
        staleTime: 1000 * 60 * 5
    });

    const handleClickPage = (pageParam) => {
        moveToList(pageParam)
    }

    const formatRoadName = (roadName) => {
        const parts = roadName.split(' ');
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1]}`;
        }
        return roadName;
    };

    const serverData = data || initState

    return (
        <div className="overflow-x-auto">
            {isFetching ? <FetchingModal/> : <></>}
            {keyword && <p className={"my-4"}>검색어 : {keyword}</p>}
            <table className="table w-full">
                <thead>
                <tr>
                    <th className="text-center">Title</th>
                    <th className="text-center">Writer</th>
                    <th className="text-center">Info</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {serverData.dtoList.map((post) => (
                    <tr key={post.id}>
                        <td className="text-left">
                            <Link to={`/post/${post.id}`} className="link link-primary font-semibold">{post.title}</Link>
                        </td>
                        <td className="text-center">{post.nickname}</td>
                        <td className="text-center">
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className={`badge ${post.participateFlag ? 'badge-success' : 'badge-error'}`}>
                                    {post.participateFlag ? '참여가능' : '마감'}
                                </span>
                                <span className="badge badge-info">
                                    <EyeIcon className="h-5 w-5 mr-2 text-red-500"/>
                                    {post.viewCount}
                                </span>
                                <span className="badge badge-warning">
                                    ❤ {post.likeCount}
                                </span>
                                <span className="badge badge-info">
                                    <MapPinIcon className="h-5 w-5 mr-2 text-red-500"/>
                                    {formatRoadName(post.roadName)}
                                </span>
                            </div>
                        </td>
                        <td className="text-center">{post.localDate}</td>
                        <td className="text-center">
                            <Link to={`/post/${post.id}`} className="btn btn-sm btn-outline btn-primary">Read More</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <PageComponent serverData={serverData} movePage={handleClickPage}/>
        </div>
    );
}

export default ListComponent;
