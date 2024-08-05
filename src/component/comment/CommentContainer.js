import React, {useEffect, useState} from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query"; 구버전의 react-query 를 import 하면 에러가 발생
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {CommentForm} from "./CommentForm";
import { fetchCommentList} from "../../api/api";
import {CommentList} from "./CommentList";
import {useCommentHook} from "../../hooks/useCommentHook";

export function CommentContainer({postId}) {


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentList, setCommentList] = useState([]);

    const queryClient = useQueryClient();

    const {
        handleAddComment,
        handleDeleteComment,
    } = useCommentHook(postId, setIsSubmitting, null);


    // 댓글 리스트를 가져오는 React Query
    // const { data, refetch } = useQuery(
    //     ["comments", postId],
    //     () => fetchCommentList(postId),
    //     {
    //         onSuccess: (data) => {
    //             setCommentList(data);
    //         },
    //         refetchOnWindowFocus: false, // 필요시 추가
    //     }
    // ); - 구버전의 react-query 코드 형식
    // v5 이상 에서는 쿼리 관련 함수 호출시 객체 형태의 인자만 허용 한다.

    const { data, refetch } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchCommentList(postId),
        enabled:!!postId,

        // onSuccess: (data) => {
        //     // setCommentList(data);
        // },
        // refetchOnWindowFocus: false,


    });

    useEffect(() => {
        if (data) {
            setCommentList(data);
            console.log("commentList updated", data);
        }
    }, [data]);


    useEffect(() => {
        if (!isSubmitting) {
            refetch();
        }
    }, [isSubmitting, refetch]);



    return (
        <div className="w-full my-12">
            <CommentForm
                isSubmitting={isSubmitting}
                onSubmit={handleAddComment} />
            <CommentList
                commentList={commentList}
                isSubmitting={isSubmitting}
                onDelete={handleDeleteComment}
                onSubmit={handleAddComment}
            />
        </div>
    );
}

export default CommentContainer;
