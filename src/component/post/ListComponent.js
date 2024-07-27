import React from 'react';
import {Link} from "react-router-dom";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import { getList} from "../../api/api";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import FetchingModal from "../common/FetchingModal";

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
    current:0
}

function ListComponent(props) {
    const {page, refresh, size, moveToList, moveToRead} = useCustomMove();

    // const dispatch = useDispatch();
    // const serverData = useSelector((state) => state.postSlice.serverData);

    // useEffect(() => {
    //     dispatch(fetchPosts({page, size}));
    // }, [dispatch, page, size, refresh]);

    const {data,isFetching,error,isError} = useQuery({
        queryKey: ['post/List', {page,size,refresh}], //쿼리를 식별자와 쿼리의 파라미터 ( queryFn 에 전달되는 데이터다. )
        queryFn:()=> getList({page,size}), // queryKey 의 파라메터가 바뀌면 자동으로 refresh 된다.
            staleTime:1000 * 60 * 5
    });

    //useQuery 는 쿼리를 실행하면 컴포넌트가 실행될 때 자동으로 데이터를 fetch 한다 -> useEffect 를 쓰지 않아도 되는 이유
    //useQuery 는 자동으로 상태관리 ( 로딩,성공,에러 (fetching,success,error) ) 를 해주므로 따로 상태관리 하는 별도의 코드가 필요가 없다

    const queryClient = useQueryClient();

    const handleClickPage = (pageParam)=>{

        moveToList(pageParam)
    }

    const serverData =data || initState

    return (
        <div className="overflow-x-auto">
            {isFetching? <FetchingModal/>:<></>}
            <table className="table w-full">
                <thead>
                <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">Title</th>
                    <th className="text-center">Actions</th>
                    <th className="text-center">Writer</th>
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
                        <td className="text-center">{post.nickname}</td>
                        <td className="text-center">{post.localDate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <PageComponent serverData={serverData} movePage={handleClickPage}/>
        </div>
    );
}

export default ListComponent;
