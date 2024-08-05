import React, { useState } from "react";
import { useCommentHook } from "../../hooks/useCommentHook";
import {PencilIcon, PlusIcon, TrashIcon, XMarkIcon} from "@heroicons/react/16/solid";
import useCustomLogin from "../../hooks/useCustomLogin";

export function CommentItem({ comment, postId, submittingState }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [commentEdited, setCommentEdited] = useState(comment.content);
    const [replyComment, setReplyComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(submittingState);
    const {isLogin,loginState} = useCustomLogin();

    const {
        handleAddComment,
        handleDeleteComment,
        handleEditComment,
        // handleDuplicateSubmit, //추가댓글
    } = useCommentHook(postId, setIsSubmitting, setIsEditing);

    return (
        <div
            // className={`flex items-start ml-${comment.depth * 5}`} 아직 depth 없음
        >

            {/*<img className="rounded-full w-16 h-16" src={comment.file_url} alt="프로필 이미지" />*/}
            <div className="w-full ml-3">
                <div className="flex justify-between">
                    <h3 className="text-lg font-bold">{comment.createdBy}</h3>
                    {/*<p className="text-base">{comment.ago}</p>*/}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        {!isEditing ? (
                            <p className="whitespace-pre-wrap pt-2 text-base">
                                {comment.content}
                            </p>
                        ) : (
                            <div>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={commentEdited}
                                    onChange={(e) => setCommentEdited(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary mt-2"
                                    disabled={isSubmitting}
                                    onClick={() => handleEditComment(comment.id, commentEdited)}
                                >
                                    수정 - 저장
                                </button>
                            </div>
                        )}
                        {isWriting && (
                            <div>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={replyComment}
                                    onChange={(e) => setReplyComment(e.target.value)}
                                    placeholder="댓글을 입력 해주세요."
                                />
                                <button
                                    className="btn btn-primary mt-2"
                                    disabled={isSubmitting}
                                    onClick={() => handleAddComment(replyComment, comment.id)}
                                >
                                    댓글-댓글 저장
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {isLogin && (
                            <>
                                {!isWriting ? (
                                    <button
                                        className="btn btn-success btn-xs"
                                        onClick={() => setIsWriting(true)}
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => setIsWriting(false)}
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </>
                        )}

                        {loginState.email === comment.createdBy && (
                            <div className="flex items-center space-x-2">
                                {!isEditing ? (
                                    <button
                                        className="btn btn-info btn-xs"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="btn btn-error btn-xs"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
