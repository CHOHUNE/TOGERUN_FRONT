import React, {useEffect, useState} from 'react';
import ResultModal from "../common/ResultModal";
import { getOne, putOne} from "../../api/api";
import useCustomMove from "../../hooks/useCustomMove";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import FetchingModal from "../common/FetchingModal";
import {initState} from "./initState";


function ModifyComponent({postId}) {

    const [post,setPost] = useState(initState)
    
    const queryClient = useQueryClient();

    const modMutation = useMutation({mutationFn: (post) => putOne(postId, post)});
    // mutation 은 데이터를 변경하는 비동기 작업에 쓰인다. useQuery 는 주로 데이터를 불러오는 작업에 쓰인다.

    const { moveToRead} = useCustomMove();

    // const [result, setResult] = useState();


    const query = useQuery({
       queryKey:['post',postId],
        queryFn:()=>    getOne(postId),
        staleTime:Infinity
    });


    useEffect(() => {
        if (query.isSuccess) {
            setPost(query.data)
        }
    }, [postId,query.data,query.isSuccess]);

    const handleChangePost = (e) => {

        post[e.target.name]=e.target.value

        setPost({...post})
    }

    const handleClickModify = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title" , post.title)
        formData.append("content" , post.content)
        formData.append("delFlag" , post.delFlag)

        modMutation.mutate(formData);

    };

    const closeModal = () => {

        queryClient.invalidateQueries(['post', postId]); // post 쿼리를 다시 불러온다.
        queryClient.invalidateQueries(['post/List']); // post/List 쿼리를 다시 불러온다.

        //다시 불러오는 이유는 수정 후 데이터가 최신이 아니기 때문이다 -> 새로고침을 해야 변경된 데이터가 로딩 됨
        // 다시 불러오는 쿼리를 실행함으로서 새로고침을 하지 않아도 최신 상태로 유지

        if (modMutation.isSuccess) {

            moveToRead(postId);
        }
    }

    return (
        <div>
            {query.isFetching || modMutation.isPending ? <FetchingModal/> : <></>}

            {modMutation.isSuccess
                ? <ResultModal title={'게시글 수정'} content={`게시물 수정이 완료 되었습니다.`}
                                                    callbackFn={closeModal}/> : <></>}

            <form onSubmit={handleClickModify} className="space-y-4">
                <h1 className="text-3xl font-bold mb-4">Modify Post</h1>
                <div className="form-control">
                    <label htmlFor="title" className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChangePost}
                        required
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="content" className="label">
                        <span className="label-text">Content</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleChangePost}
                        required
                        className="textarea textarea-bordered"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Modify</button>
            </form>
        </div>
    );
}

export default ModifyComponent;
