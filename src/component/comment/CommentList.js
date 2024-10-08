import React from "react";
import {CommentItem} from "./CommentItem";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/outline";

export function CommentList({

                                commentList,
                                onDelete,
                                setIsSubmitting,
                                postId

                            }) {

    const processComments = (comments) => {
        return comments.map(comment => {
            // 각 댓글은 ["com.example.simplechatapp.dto.CommentResponseDto", {...}] 형태
            const commentData = comment[1];  // 실제 댓글 데이터는 두 번째 요소
            return {
                ...commentData,
                children: commentData.children ? processComments(commentData.children) : []
            };
        });
    };

    // 처리된 댓글 리스트
    const processedComments = processComments(commentList);




    return (
        <div className="card mt-12 shadow-md">
            <div className="card-header p-4 bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-white"/>
                    <h2 className="card-title text-xl font-bold text-white">댓글 리스트</h2>
                </div>
            </div>
            <div className="card-body space-y-4">
                {processedComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        submittingState={setIsSubmitting}
                        comment={comment}
                        onSubitComment={null}
                        onDelete={onDelete}
                        postId={postId}
                    />
                ))}
            </div>
        </div>
    );
}
