import React, {useEffect, useState} from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query"; 구버전의 react-query 를 import 하면 에러가 발생
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {CommentForm} from "./CommentForm";
import { fetchCommentList} from "../../api/api";
import {CommentList} from "./CommentList";
import {useCommentHook} from "../../hooks/useCommentHook";

export function CommentContainer({postId}) {


    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [commentList, setCommentList] = useState([]);
    // 상태 관리를 react-query 로 대체
    // data를 직접 쓰는 방식으로 변경

    const queryClient = useQueryClient();

    const {
        handleAddComment,
        handleDeleteComment,
    } = useCommentHook(postId, setIsSubmitting, null);



    const { data:commentList, refetch } = useQuery({

        queryKey: ["comments", postId],
        queryFn: () => fetchCommentList(postId),
        enabled:!!postId,

    });

    // useEffect(() => {
    //     if (data) {
    //         setCommentList(data);
    //         console.log("commentList updated", data);
    //     }
    // }, [data]);


    // useEffect(() => {
    //     if (!isSubmitting) {
    //         refetch();
    //     }
    // }, [isSubmitting, refetch]);



    return (
        <div className="w-full my-12">
            <CommentForm
                isSubmitting={isSubmitting}
                onSubmit={handleAddComment} />

            <CommentList
                commentList={commentList || [] }
                isSubmitting={isSubmitting}
                onDelete={handleDeleteComment}
                onSubmit={handleAddComment}
                postId={postId}
            />
        </div>
    );
}

export default CommentContainer;
