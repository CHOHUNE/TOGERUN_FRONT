import React, { useState } from "react";
import { useCommentHook } from "../../hooks/useCommentHook";
import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import useCustomLogin from "../../hooks/useCustomLogin";

export function CommentItem({ comment, postId, submittingState }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [commentEdited, setCommentEdited] = useState(comment.content);
    const [replyComment, setReplyComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(submittingState);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { isLogin, loginState } = useCustomLogin();

    const {
        handleAddComment,
        handleDeleteComment,
        handleEditComment,
    } = useCommentHook(postId, setIsSubmitting, setIsEditing, setIsWriting);

    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

    const confirmDelete = () => {
        handleDeleteComment(comment.id);
        toggleDeleteModal();
    };

    return (
        <div className="ml-4 mt-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    {comment.img ? (
                        <img
                            src={comment.img}
                            alt={`${comment.createdBy}'s profile`}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <UserCircleIcon className="w-10 h-10 text-gray-400" />
                    )}
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">{comment.name}</h3>
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
                                <>
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
                                        onClick={toggleDeleteModal}
                                        className="btn btn-error btn-xs"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-1">
                        {!isEditing ? (
                            <p className="whitespace-pre-wrap text-base">
                                {comment.content}
                            </p>
                        ) : (
                            <div>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={commentEdited}
                                    onChange={(e) => setCommentEdited(e.target.value)}
                                    onKeyDown={(e) => handleEditComment(comment.id, commentEdited, e)}
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
                            <div className="mt-2">
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={replyComment}
                                    onChange={(e) => setReplyComment(e.target.value)}
                                    placeholder="댓글을 입력 해주세요."
                                    onKeyDown={(e) => handleAddComment(replyComment, comment.id, e)}
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
                </div>
            </div>

            {comment.children && comment.children.length > 0 && (
                <div className="mt-4 space-y-4 ml-10">
                    {comment.children.map((childComment) => (
                        <CommentItem
                            key={childComment.id}
                            comment={childComment}
                            postId={postId}
                            submittingState={isSubmitting}
                            setIsSubmitting={setIsSubmitting}
                        />
                    ))}
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-4">댓글을 삭제하시겠습니까?</h3>
                        <div className="flex justify-end space-x-2">
                            <button className="btn btn-error" onClick={confirmDelete}>삭제</button>
                            <button className="btn btn-ghost" onClick={toggleDeleteModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}