import React from "react";
import {CommentItem} from "./CommentItem";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/outline";

export function CommentList({
                                commentList,
                                onDelete,
                                setIsSubmitting,
                                postId,
                                postAuthorNickname,
                                loginState
                            }) {
    const processComments = (comments) => {
        return comments.map(comment => {
            const commentData = comment[1];
            const processedChildren = commentData.children ? processComments(commentData.children) : [];

            // 댓글이 삭제되었고 자식 댓글이 없으면 null을 반환
            if (commentData.delFlag && processedChildren.length === 0) {
                return null;
            }

            return {
                ...commentData,
                children: processedChildren
            };
        }).filter(comment => comment !== null); // null인 댓글 제거
    };

    // 처리된 댓글 리스트
    const processedComments = processComments(commentList);

    return (
        <div className="card mt-8 sm:mt-12 shadow-md overflow-hidden rounded-lg">
            <div className="card-header p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 border-b-4 border-white">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>
                    <h2 className="card-title text-lg sm:text-xl font-bold text-white">댓글 리스트</h2>
                </div>
            </div>
            <div className="card-body space-y-3 sm:space-y-4 p-4 sm:p-6">
                {processedComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        submittingState={setIsSubmitting}
                        comment={comment}
                        onSubitComment={null}
                        onDelete={onDelete}
                        postId={postId}
                        postAuthorNickname={postAuthorNickname}
                        loginState={loginState}
                    />
                ))}
            </div>
        </div>
    );
}