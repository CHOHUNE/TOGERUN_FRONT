import React from 'react';
import {deleteOne, getOne,} from "../../api/api";
import {Link} from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {initState} from "./initState";
import useCustomLogin from "../../hooks/useCustomLogin";
import FetchingModal from "../common/FetchingModal";




function ReadComponent({postId}) {
    // const dispatch = useDispatch();
    // const post = useSelector((state) => state.postSlice.serverData.dtoList.find((p) => p.id === Number(postId)));
    // const [result, setResult] = useState();

    const {data,isFetching} = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getOne(postId),
        staleTime: 1000 * 60 * 30
    });

    const queryClient = useQueryClient();

    const post = data || initState;

    // useEffect(() => {
    //     dispatch(fetchPostById(postId));
    // }, [dispatch, postId]);

    const {moveToList, moveToModify,size,page} = useCustomMove();

    const {loginState} = useCustomLogin();

    const delMutation = useMutation({mutationFn: (postId) => deleteOne(postId)});

    function handleClickDelete() {
        // deleteOne(postId).then(result => {
        //     setResult(postId);
        // });
        // console.log(result);

        delMutation.mutate(postId)
    }

    const closeModal = () => {

        queryClient.invalidateQueries(['post', postId]);
        queryClient.invalidateQueries(['post/List']);

        if(delMutation.isSuccess){
            moveToList()
        }
    }

    if (!post) {
        return <div>Loading..</div>;
    }

    return (<div className="card bg-base-100 shadow-xl">

        {isFetching? <FetchingModal/> : <></>}
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
        {delMutation.isSuccess?
        <ResultModal title={'게시글 삭제'} content={`게시물 삭제가 완료 되었습니다.`}
                               callbackFn={closeModal}/> : <></>}
    </div>);
}

export default ReadComponent;
