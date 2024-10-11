import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCommentAPI, deleteCommentAPI, modifyCommentAPI } from "../api/commentAPI";

export const useCommentHook = (postId) => {
    const queryClient = useQueryClient();

    const addComment = useMutation({
        mutationFn: (newComment) => addCommentAPI(newComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => {
            console.error("댓글 추가 실패:", error);
        },
    });

    const deleteComment = useMutation({
        mutationFn: (commentId) => deleteCommentAPI(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => {
            console.error("댓글 삭제 실패:", error);
            alert("삭제 실패");
        },
    });

    const editComment = useMutation({
        mutationFn: (editedComment) => modifyCommentAPI(editedComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정 중 오류가 발생했습니다.");
        },
    });

    const handleAddComment = async (content, parentId, event = null) => {
        if (!event || (event.key === "Enter" && !event.shiftKey)) {
            if (event) event.preventDefault();

            try {
                await addComment.mutateAsync({
                    post_id: postId,
                    content: content,
                    parent_id: parentId,
                });
                return true; // 성공 시 true 반환
            } catch (error) {
                return false; // 실패 시 false 반환
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment.mutateAsync(commentId);
            return true; // 성공 시 true 반환
        } catch (error) {
            return false; // 실패 시 false 반환
        }
    };

    const handleEditComment = async (commentId, content, event = null) => {
        if (!event || (event.key === "Enter" && !event.shiftKey)) {
            if (event) event.preventDefault();

            try {
                await editComment.mutateAsync({
                    id: commentId,
                    post_id: postId,
                    content: content,
                });
                return true; // 성공 시 true 반환
            } catch (error) {
                return false; // 실패 시 false 반환
            }
        }
    };

    return {
        handleAddComment,
        handleDeleteComment,
        handleEditComment,
        isAddingComment: addComment.isLoading,
        isDeletingComment: deleteComment.isLoading,
        isEditingComment: editComment.isLoading,
    };
};