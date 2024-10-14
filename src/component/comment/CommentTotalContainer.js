import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CommentWritingForm } from "./CommentWritingForm";
import { CommentList } from "./CommentList";
import { useCommentHook } from "../../hooks/useCommentHook";
import { fetchCommentList } from "../../api/commentAPI";

export function CommentTotalContainer({ postId }) {
    const {
        handleAddComment,
        handleDeleteComment,
        isSubmitting,
        setIsSubmitting
    } = useCommentHook(postId);

    const { data: commentList, isLoading, isError } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchCommentList(postId),
        enabled: !!postId,
    });

    if (isLoading) {
        return (
            <div className="w-full my-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full my-12 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                댓글을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
            </div>
        );
    }

    return (
        <div className="w-full my-4 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6">
                <CommentWritingForm
                    isSubmitting={isSubmitting}
                    onSubmit={handleAddComment}
                />
                <div className="mt-6 sm:mt-8">
                    <CommentList
                        commentList={commentList || []}
                        isSubmitting={isSubmitting}
                        onDelete={handleDeleteComment}
                        onSubmit={handleAddComment}
                        postId={postId}
                    />
                </div>
            </div>
        </div>
    );
}
export default CommentTotalContainer;