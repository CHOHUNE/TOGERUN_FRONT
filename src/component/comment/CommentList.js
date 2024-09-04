import React from "react";
import {CommentItem} from "./CommentItem";

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
            <div className="card-header">
                <h2 className="card-title text-lg font-semibold">댓글 리스트</h2>
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
