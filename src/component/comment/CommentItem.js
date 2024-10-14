import React, { useState } from "react";
import { useCommentHook } from "../../hooks/useCommentHook";
import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon, UserCircleIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import useCustomLogin from "../../hooks/useCustomLogin";
import ResultModal from "../common/ResultModal";

export function CommentItem({ comment, postId, submittingState }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [commentEdited, setCommentEdited] = useState(comment.content);
    const [replyComment, setReplyComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(submittingState);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultModalProps, setResultModalProps] = useState({});
    const { isLogin, loginState } = useCustomLogin();

    const {
        handleAddComment: hookHandleAddComment,
        handleDeleteComment,
        handleEditComment,
    } = useCommentHook(postId, setIsSubmitting, setIsEditing, setIsWriting);

    const toggleConfirmModal = () => setShowConfirmModal(!showConfirmModal);

    const confirmAction = async () => {
        toggleConfirmModal();
        try {
            await handleDeleteComment(comment.id);
            setResultModalProps({
                title: "작업 완료",
                content: comment.delFlag ? "댓글이 복구되었습니다." : "댓글이 삭제되었습니다.",
                callbackFn: () => setShowResultModal(false)
            });
            setShowResultModal(true);
        } catch (error) {
            setResultModalProps({
                title: "오류 발생",
                content: "작업 중 오류가 발생했습니다. 다시 시도해주세요.",
                callbackFn: () => setShowResultModal(false)
            });
            setShowResultModal(true);
        }
    };

    const handleEdit = async (commentId, content, event) => {
        if (event && event.key !== 'Enter') return;
        try {
            await handleEditComment(commentId, content);
            setIsEditing(false);
            setResultModalProps({
                title: "수정 완료",
                content: "댓글이 성공적으로 수정되었습니다.",
                callbackFn: () => setShowResultModal(false)
            });
            setShowResultModal(true);
        } catch (error) {
            setResultModalProps({
                title: "수정 오류",
                content: "댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
                callbackFn: () => setShowResultModal(false)
            });
            setShowResultModal(true);
        }
    };

    const handleAddComment = async (content, parentId, event) => {
        if (event && event.key !== 'Enter') return;
        try {
            await hookHandleAddComment(content, parentId);
            setIsWriting(false);
            setReplyComment("");
            setResultModalProps({
                title: "댓글 추가 완료",
                content: "댓글이 성공적으로 추가되었습니다.",
                callbackFn: () => setShowResultModal(false)
            });
            setShowResultModal(true);
        } catch (error) {
            setResultModalProps({
                title: "댓글 추가 오류",
                content: "댓글 추가 중 오류가 발생했습니다. 다시 시도해주세요.",
                callbackFn: () => setShowResultModal(false)
            });
            setShowResultModal(true);
        }
    };

    return (
        <div className={`ml-0 sm:ml-4 mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg ${comment.parentId ? 'border-l-4 border-blue-300' : ''}`}>
            <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0">
                    {comment.img ? (
                        <img
                            src={comment.img}
                            alt={`${comment.createdBy}'s profile`}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                    ) : (
                        <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    )}
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-center flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold">{comment.name}</h3>
                        <div className="flex items-center space-x-1 sm:space-x-2 mt-1 sm:mt-0">
                            {isLogin && (
                                <>
                                    {!isWriting ? (
                                        <button
                                            className="btn btn-success btn-xs sm:btn-sm"
                                            onClick={() => setIsWriting(true)}
                                        >
                                            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-ghost btn-xs sm:btn-sm"
                                            onClick={() => setIsWriting(false)}
                                        >
                                            <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                    )}
                                </>
                            )}

                            {loginState.email === comment.createdBy && (
                                <>
                                    {!comment.delFlag && (
                                        <>
                                            {!isEditing ? (
                                                <button
                                                    className="btn btn-info btn-xs sm:btn-sm"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-ghost btn-xs sm:btn-sm"
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                    <button
                                        onClick={toggleConfirmModal}
                                        className={`btn btn-xs sm:btn-sm ${comment.delFlag ? 'btn-warning' : 'btn-error'}`}
                                    >
                                        {comment.delFlag ? <ArrowUturnLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-2">
                        {comment.delFlag ? (
                            <p className="text-gray-500 italic text-sm">삭제된 댓글입니다</p>
                        ) : !isEditing ? (
                            <p className="whitespace-pre-wrap text-sm sm:text-base">
                                {comment.content}
                            </p>
                        ) : (
                            <div>
                                <textarea
                                    className="textarea textarea-bordered w-full text-sm sm:text-base"
                                    value={commentEdited}
                                    onChange={(e) => setCommentEdited(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleEdit(comment.id, commentEdited);
                                        }
                                    }}
                                />
                                <button
                                    className="btn btn-primary btn-sm mt-2"
                                    disabled={isSubmitting}
                                    onClick={() => handleEdit(comment.id, commentEdited)}
                                >
                                    수정 완료
                                </button>
                            </div>
                        )}
                        {isWriting && (
                            <div className="mt-2">
                                <textarea
                                    className="textarea textarea-bordered w-full text-sm sm:text-base"
                                    value={replyComment}
                                    onChange={(e) => setReplyComment(e.target.value)}
                                    placeholder="대댓글을 입력해주세요."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment(replyComment, comment.id);
                                        }
                                    }}
                                />
                                <button
                                    className="btn btn-primary btn-sm mt-2"
                                    disabled={isSubmitting}
                                    onClick={() => handleAddComment(replyComment, comment.id)}
                                >
                                    대댓글 작성
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {comment.children && comment.children.length > 0 && (
                <div className="mt-4 space-y-4 ml-4 sm:ml-8">
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

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full mx-4">
                        <h3 className="font-bold text-lg mb-4">
                            {comment.delFlag ? "댓글을 복구하시겠습니까?" : "댓글을 삭제하시겠습니까?"}
                        </h3>
                        <div className="flex justify-end space-x-2">
                            <button
                                className={`btn btn-sm sm:btn-md ${comment.delFlag ? 'btn-warning' : 'btn-error'}`}
                                onClick={confirmAction}
                            >
                                {comment.delFlag ? "복구" : "삭제"}
                            </button>
                            <button className="btn btn-ghost btn-sm sm:btn-md" onClick={toggleConfirmModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {showResultModal && <ResultModal {...resultModalProps} />}
        </div>
    );
}