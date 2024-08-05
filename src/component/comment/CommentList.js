import React from "react";
import {CommentItem} from "./CommentItem";

export function CommentList({
                                         commentList,
                                         onDelete,
                                         setIsSubmitting,
                                     }) {

    return (
        <div className="card mt-12 shadow-md">
            <div className="card-header">
                <h2 className="card-title text-lg font-semibold">댓글 리스트</h2>
            </div>
            <div className="card-body space-y-4">
                {commentList.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        isSubmitting={false}
                        setIsSubmitting={setIsSubmitting}
                        comment={comment}
                        onSubitComment={null}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
